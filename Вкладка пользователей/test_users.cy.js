describe('Проверка вкладки пользователей', () => {
    it('Вход под ролью регионального админа', () => {

        cy.viewport(1920, 1080)
        cy.visit('auth/')
        cy.once('uncaught:exception', () => false)
      
        // вводим данные
        cy.get("[type='text']").type('reg_admin@test.com')
        cy.get("[type='password']").type('123')
  
        cy.get("[data-cy='submit-login-form']").click()
        
        // переходим на вкладку пользователей
        cy.get("[for='check']").click()
        cy.contains("СПИСОК ПОЛЬЗОВАТЕЛЕЙ")

        // переходим на вкладку пользователей и фильтруем их по МО
        cy.visit('users/')
        cy.get(".css-19bb58m").click()
        cy.get("[id$='option-4']").click()
        cy.get("[data-cy='user-search']").click()
        cy.get(".card-item-body").should("contain", "Санкт-Петербургское государственное бюджетное учреждение здравоохранения \"Городская Александровская больница\"")

        // переходим на вкладку добавления пользователя и проверяем что при отмене будет выход на список пользователей
        cy.get("[data-cy='add-user']").click()
        cy.get("[data-cy='user-email']")
        cy.get("[data-cy='user-cancel']").click()
        cy.get("[data-cy='add-user']").click()

        // проверяем выделение обязательных полей
        cy.get("[data-cy='user-email']")
        cy.get("[data-cy='user-save']").click()
        cy.get("[data-cy='user-email'] > .form-input__title_error")
        cy.get("[data-cy='user-password'] > .form-input__title_error")
        cy.get("[data-cy='user-repeat-password'] > .form-input__title_error")
        cy.get("[data-cy='user-full-name'] > .form-input__title_error")
        cy.get("[data-cy='user-roles'] > .form-select__title_error")
        cy.get("[data-cy='user-organization'] > .form-select__title_error")

        // проверяем что неверный формат почты не принимается
        cy.get("[data-cy='user-email'] > input").type(123)
        cy.get("[data-cy='user-save']").click()
        cy.get("[data-cy='user-email'] > .form-input__title_error")

        // заносим верную почту и проверяем что выделения красным больше нет
        let ms = Date.now()
        let email = "test" + ms + "@test.com"
        cy.get("[data-cy='user-email'] > input").clear().type(email)
        cy.get("[data-cy='user-save']").click()
        cy.get("[data-cy='user-email'] > .form-input__title_error").should('not.exist')

        // заносим данные и сохраняем
        cy.get("[data-cy='user-full-name'] > input").type("Тестов Тест Тестович")
        cy.get("[data-cy='user-photo'] > div > div > div > label").selectFile("C:/Users/User/cypress/cypress/practitioner.jpg")
        cy.get("[data-cy='user-roles'] > div").click()
        cy.get("[data-cy='option-0']").click()
        cy.get("[data-cy='user-organization'] > div").click()
        cy.get("[data-cy='option-4']").click()
        
        // проверяем что есть проверка на корректность паролей
        cy.get("[data-cy='user-password'] > input").type("123")
        cy.get("[data-cy='user-repeat-password'] > input").type("1234")
        cy.get("[data-cy='user-save']").click()
        cy.contains("Пароли не совпадают")

        // корректно вводим пароли и сохраняем
        cy.get("[data-cy='user-repeat-password'] > input").clear().type("123")
        cy.get("[data-cy='user-save']").click()

        // проверяем что есть фото
        cy.get(".form-container> div > div:nth-child(2) > div > img", {timeout: 20000})

        // проверяем что без СНИЛС задизейблены кнопки добавления консультирующего врача и роли в системе "Телемедицинские заявки"
        cy.get("[data-cy='add-schedule-doctor']").should('be.disabled')
        cy.get("[data-cy='user-add-role-context']").should('be.disabled')

        // редактируем пользователя и добавляем ему СНИЛС
        cy.get("[data-cy='edit-user']").click()
        cy.get("[data-cy='user-snils'] > input").type("01069948355")
        cy.get("[data-cy='user-save']").click()
        cy.contains("01069948355")

        // добавляем консультирующего врача
        cy.get("[data-cy='add-schedule-doctor']").click()
        cy.contains("Искать врача", {timeout: 5000}).click()
        cy.contains("Сохранить", {timeout: 100000}).click()

        // добавляем роль в системе "Телемедицинские заявки"


        // ищем созданного пользователя
        cy.get("[data-cy='to-users-list']").click()
        cy.contains(email)
        cy.get("[placeholder='Поиск']", {timeout: 5000}).type(email)
        cy.get("[data-cy='user-search']").click()
        cy.get(".user-card-item-email").should("contain", email)
        cy.get(".total__count").should("contain", "1")        

        // удаляем пользователя
        cy.get(".card-item-remove > div").click()
        cy.get("[data-cy='add-yes']").click()

        // проверяем что больше нет пользователя с таким email
        cy.get(".total__count").should("contain", "0")

    })
    // it('Вход под ролью администратора МО', () => {

    //     cy.viewport(1920, 1080)
    //     cy.visit('auth/')
    //     cy.once('uncaught:exception', () => false)

    //     // вводим данные
    //     cy.get("[type='text']").type('white@mail.ru')
    //     cy.get("[type='password']").type('123')

    //     cy.get("[data-cy='submit-login-form']").click()

    //     // переходим на вкладку пользователей и проверяем что отображаются пользователи только по МО админа
    //     cy.contains("СПИСОК ПОЛЬЗОВАТЕЛЕЙ").click()
    //     cy.get(".css-olqui2-singleValue").should("contain", "Санкт-Петербургское государственное бюджетное учреждение здравоохранения \"Городская Александровская больница\"")

    //     // переходим на вкладку добавления пользователя
    //     cy.get("[data-cy='add-user']").click()

    //     // заносим данные и сохраняем
    //     let ms = Date.now()
    //     let email = "test" + ms + "@test.com"
    //     cy.get("[data-cy='user-email'] > input").type(email)
    //     cy.get("[data-cy='user-password'] > input").type("123")
    //     cy.get("[data-cy='user-repeat-password'] > input").type("123")
    //     cy.get("[data-cy='user-full-name'] > input").type("Тестов Тест Тестович")
    //     cy.get(".css-19bb58m").click()
    //     cy.get("[data-cy='option-0']").click()
    //     cy.get("[data-cy='user-save']").click()

    //     // ищем созданного пользователя и затем удаляем
    //     cy.get("[data-cy='to-users-list']").click()
    //     cy.get("[placeholder='Поиск']", {timeout: 5000}).type(email)
    //     cy.get("[data-cy='user-search']").click()
    //     cy.get(".user-card-item-email").should("contain", email)
    //     cy.get(".total__count").should("contain", "1")

    //     cy.get(".card-item-remove > div").click()
    //     cy.get("[data-cy='add-yes']").click()

    //     // проверяем что больше нет пользователя с таким email
    //     cy.get(".total__count").should("contain", "0")
    // })
  })