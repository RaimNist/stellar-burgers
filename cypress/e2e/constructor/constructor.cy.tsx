/// <reference types="cypress" />

describe('Конструктор бургера — интеграционные сценарии', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as('createOrder');

    cy.visit('http://localhost:4000');

    cy.setCookie('accessToken', 'aaa.bbb.ccc');
    localStorage.setItem('refreshToken', 'mock-refresh-token');

    cy.getCookie('accessToken').should('exist');

    cy.wait('@getIngredients');
  });

  it('Добавление булок и начинок в конструктор', () => {    
    // Булка
    cy.get('[data-testid="add-ingredient-643d69a5c3f7b9001cfa093c"] button').click();

    // Начинка
    cy.get('[data-testid="add-ingredient-643d69a5c3f7b9001cfa0941"] button').click();

    // Ингредиенты добавлены в конструктор
    cy.get('[data-testid="ingredient-643d69a5c3f7b9001cfa093c"]').should('exist');
    cy.get('[data-testid="ingredient-643d69a5c3f7b9001cfa0941"]').should('exist');
  });

  it('Работа модальных окон: открытие, закрытие по крестику, по оверлею', () => {
    // Открытие модального окна ингредиента
    cy.get('[data-testid="ingredient-link-643d69a5c3f7b9001cfa0941"]').click({ force: true });

    // Модалка открыта
    cy.get('[data-testid="modal"]').should('be.visible');

    // Закрытие по клику на крестик
    cy.get('[data-testid="modal-close"]').click({ force: true });

    // Модалка закрыта
    cy.get('[data-testid="modal"]').should('not.exist');

    // Повторное открытие модального окна ингредиента
    cy.get('[data-testid="ingredient-link-643d69a5c3f7b9001cfa093e"]').click({ force: true });

    // Модалка открыта
    cy.get('[data-testid="modal"]').should('be.visible');

    // Закрытие по клику на оверлей
    cy.get('[data-testid="modal-overlay"]').click({ force: true });

    // Модалка закрыта
    cy.get('[data-testid="modal"]').should('not.exist');
  });

  it('Создание заказа', () => {
    // Добавлены ингредиенты
    cy.get('[data-testid="add-ingredient-643d69a5c3f7b9001cfa093c"] button').click();
    cy.get('[data-testid="add-ingredient-643d69a5c3f7b9001cfa093e"] button').click();

    // Клик по кнопке «Оформить заказ»
    cy.get('[data-testid="order-button"]').click({ force: true });

    // POST запрос
    cy.wait('@createOrder');

    // Модалка открыта и номер заказа верный
    cy.get('[data-testid="modal"]').should('contain', '96219');

    // Закрытие по клику на оверлей
    cy.get('[data-testid="modal-overlay"]').click({ force: true });

    // Модалка закрыта
    cy.get('[data-testid="modal"]').should('not.exist');

    // Конструктор пуст
    cy.contains('Выберите булки').should('exist');
    cy.contains('Выберите начинку').should('exist');
  });
});
