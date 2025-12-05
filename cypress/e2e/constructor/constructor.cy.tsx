/// <reference types="cypress" />

const SELECTORS = {
  modal: '[data-testid="modal"]',
  modalClose: '[data-testid="modal-close"]',
  modalOverlay: '[data-testid="modal-overlay"]',
  orderButton: '[data-testid="order-button"]',
  addIngredient: (id: string) => `[data-testid="add-ingredient-${id}"] button`,
  ingredientLink: (id: string) => `[data-testid="ingredient-link-${id}"]`,
  ingredient: (id: string) => `[data-testid="ingredient-${id}"]`
};

const closeModalByOverlay = () => cy.get(SELECTORS.modalOverlay).click({ force: true });
const closeModalByButton = () => cy.get(SELECTORS.modalClose).click({ force: true });
const assertModalClosed = () => cy.get(SELECTORS.modal).should('not.exist');

describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as('createOrder');

    cy.visit('/');

    cy.setCookie('accessToken', 'aaa.bbb.ccc');
    localStorage.setItem('refreshToken', 'mock-refresh-token');

    cy.getCookie('accessToken').should('exist');

    cy.wait('@getIngredients');
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    localStorage.removeItem('refreshToken');
  });

  it('Добавление булок и начинок в конструктор', () => {
    // Получаем названия ингредиентов перед добавлением
    cy.get(SELECTORS.ingredient('643d69a5c3f7b9001cfa093c'))
      .find('p')
      .last()
      .invoke('text')
      .then((bunName) => {
        const bun = bunName.trim();

        cy.get(SELECTORS.addIngredient('643d69a5c3f7b9001cfa093c')).as('addBun');
        cy.get('@addBun').click();

        // Проверяем, что в конструкторе появился элемент с тем же именем
        cy.get('[data-testid="constructor-root"]').contains(bun).should('exist');
      });

    cy.get(SELECTORS.ingredient('643d69a5c3f7b9001cfa0941'))
      .find('p')
      .last()
      .invoke('text')
      .then((fillingName) => {
        const filling = fillingName.trim();

        cy.get(SELECTORS.addIngredient('643d69a5c3f7b9001cfa0941')).as('addFilling');
        cy.get('@addFilling').click();

        // Проверяем, что в конструкторе появился элемент с тем же именем
        cy.get('[data-testid="constructor-list"]').contains(filling).should('exist');
      });
  });

  it('Работа модальных окон: открытие, закрытие по крестику, по оверлею', () => {
    // Алиас для ссылки ингредиента
    cy.get(SELECTORS.ingredientLink('643d69a5c3f7b9001cfa0941')).as('linkFilling');
    cy.get('@linkFilling').click({ force: true });

    // Алиас модалки
    cy.get(SELECTORS.modal).as('modal').should('be.visible');

    // Алиас кнопки закрытия внутри модалки
    cy.get(SELECTORS.modalClose).as('modalClose');
    cy.get('@modalClose').click({ force: true });
    assertModalClosed();

    // Открываем другую модалку
    cy.get(SELECTORS.ingredientLink('643d69a5c3f7b9001cfa093e')).as('linkFilet');
    cy.get('@linkFilet').click({ force: true });

    cy.get('@modal').should('be.visible');
    cy.get(SELECTORS.modalOverlay).as('overlay');
    cy.get('@overlay').click({ force: true });
    assertModalClosed();
  });

  it('Создание заказа', () => {
    // Алиасы для кнопок добавления и кнопки заказа
    cy.get(SELECTORS.addIngredient('643d69a5c3f7b9001cfa093c')).as('addBun');
    cy.get(SELECTORS.addIngredient('643d69a5c3f7b9001cfa093e')).as('addFilet');
    cy.get(SELECTORS.orderButton).as('orderBtn');

    // Сохраняем имена ингредиентов и проверяем что именно они добавлены
    cy.get(SELECTORS.ingredient('643d69a5c3f7b9001cfa093c')).find('p').invoke('text').as('bunName');
    cy.get(SELECTORS.ingredient('643d69a5c3f7b9001cfa093e')).find('p').invoke('text').as('filetName');

    cy.get('@addBun').click();
    cy.get('@addFilet').click();

    cy.get('@orderBtn').click({ force: true });

    cy.wait('@createOrder');


    cy.get(SELECTORS.modal).as('modal').should('contain', '96219');
    cy.get(SELECTORS.modalOverlay).as('overlay').click({ force: true });
    assertModalClosed();

    cy.get('[data-testid="constructor-root"]').contains('Выберите булки').should('exist');
    cy.get('[data-testid="constructor-list"]').contains('Выберите начинку').should('exist');

    // Убеждаемся, что добавленные имена больше не отображаются в конструкторе
    cy.get('@bunName').then((bn: unknown) => {
      const name = String(bn).trim();
      cy.get('[data-testid="constructor-root"]').contains(name).should('not.exist');
    });

    cy.get('@filetName').then((fn: unknown) => {
      const name = String(fn).trim();
      cy.get('[data-testid="constructor-list"]').contains(name).should('not.exist');
    });
  });
});
