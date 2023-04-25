describe('Проверка вкладки пользователей', () => {
    it('Вход под ролью регионального админа', () => {

        cy.viewport(1920, 1080)
        cy.visit('auth/')
        cy.once('uncaught:exception', () => false)
      
        // вводим данные
        cy.get("[type='text']").type('reg_admin@test.com')
        cy.get("[type='password']").type('123')
  
        cy.get(".button__primary").click()
        
        // переходим на вкладку пользователей
        cy.get("[for='check']").click()
        cy.contains("СПИСОК ПОЛЬЗОВАТЕЛЕЙ")

        // переходим на вкладку пользователей и фильтруем их по МО
        cy.visit('users/')
        cy.get(".css-19bb58m").click()
        cy.get("[id$='option-4']").click()
        cy.get("[data-cy='user-search']").click()
        cy.get(".card-item-body").should("contain", "Санкт-Петербургское государственное бюджетное учреждение здравоохранения \"Городская Александровская больница\"")

        // переходим на вкладку добавления пользователя
        cy.get("[data-cy='add-user']").click()

        // заносим данные и сохраняем
        let ms = Date.now()
        let email = "test" + ms + "@test.com"
        cy.get("[data-cy='user-email'] > input").type(email)
        cy.get("[data-cy='user-password'] > input").type("123")
        cy.get("[data-cy='user-repeat-password'] > input").type("123")
        cy.get("[data-cy='user-full-name'] > input").type("Тестов Тест Тестович")
        cy.get("[data-cy='user-roles'] > div").click()
        cy.get("[data-cy='option-0']").click()
        cy.get("[data-cy='user-organization'] > div").click()
        cy.get("[data-cy='option-4']").click()
        cy.get("[data-cy='user-save']").click()

        // ищем созданного пользователя и затем удаляем
        cy.get("[data-cy='to-users-list']").click()
        cy.contains(email)
        cy.get("[placeholder='Поиск']", {timeout: 5000}).type(email)
        cy.get("[data-cy='user-search']").click()
        cy.get(".user-card-item-email").should("contain", email)
        cy.get(".total__count").should("contain", "1")        

        cy.get(".card-item-remove > div").click()
        cy.get("[data-cy='add-yes']").click()

        // проверяем что больше нет пользователя с таким email
        cy.get(".total__count").should("contain", "0")

    }),
    it('Вход под ролью администратора МО', () => {

        cy.viewport(1920, 1080)
        cy.visit('auth/')
        cy.once('uncaught:exception', () => false)

        // вводим данные
        cy.get("[type='text']").type('white@mail.ru')
        cy.get("[type='password']").type('123')

        cy.get(".button__primary").click()

        // переходим на вкладку пользователей и проверяем что отображаются пользователи только по МО админа
        cy.contains("СПИСОК ПОЛЬЗОВАТЕЛЕЙ").click()
        cy.get(".css-olqui2-singleValue").should("contain", "Санкт-Петербургское государственное бюджетное учреждение здравоохранения \"Городская Александровская больница\"")

        // переходим на вкладку добавления пользователя
        cy.get("[data-cy='add-user']").click()

        // заносим данные и сохраняем
        let ms = Date.now()
        let email = "test" + ms + "@test.com"
        cy.get("[data-cy='user-email'] > input").type(email)
        cy.get("[data-cy='user-password'] > input").type("123")
        cy.get("[data-cy='user-repeat-password'] > input").type("123")
        cy.get("[data-cy='user-full-name'] > input").type("Тестов Тест Тестович")
        cy.get(".css-19bb58m").click()
        cy.get("[data-cy='option-0']").click()
        cy.get("[data-cy='user-save']").click()

        // ищем созданного пользователя и затем удаляем
        cy.get("[data-cy='to-users-list']").click()
        cy.get("[placeholder='Поиск']", {timeout: 5000}).type(email)
        cy.get("[data-cy='user-search']").click()
        cy.get(".user-card-item-email").should("contain", email)
        cy.get(".total__count").should("contain", "1")

        cy.get(".card-item-remove > div").click()
        cy.get("[data-cy='add-yes']").click()

        // проверяем что больше нет пользователя с таким email
        cy.get(".total__count").should("contain", "0")
    })
  })