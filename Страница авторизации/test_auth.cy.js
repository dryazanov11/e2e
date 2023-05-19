describe('Валидация при входе на портал', () => {
    it('Некорректный ввод данных при авторизации', () => {

        cy.viewport(1920, 1080)
        cy.visit('/')
      
    //  вводим неверные данные
        cy.get("[type='text']").type('example@example.com')
        cy.get("[type='password']").type('123')
  
        cy.get("[data-cy='submit-login-form']").click()

    //  проверяем что получена ошибка
        cy.contains("Неверный e-mail или пароль")

    }),
    it('Восстановление пароля', () => {

        cy.viewport(1920, 1080)
        cy.visit('/')

        cy.contains("Забыли пароль?").click()
      
    //  вводим неверные данные
        cy.get(".form-input").type('example@example.com')
        cy.get(".button__primary").click()

    //  проверяем что получена ошибка
        cy.contains("Пользователь не найден")

    //  вводим верные данные
        cy.get(".form-input").clear().type("reg_admin@test.com")
        cy.get(".button__primary").click()

    //  проверяем что письмо отправлено
        cy.contains("Письмо отправлено")

    }),
    it('Успешный вход на портал через ЕСИА', () => {

        cy.viewport(1920, 1080)
        cy.visit('/')

        // выбираем вариант входа через ЕСИА
        cy.get("[data-cy='esia-login']").click()

        // перенаправление на сайт ЕСИА
        cy.origin('https://esia-portal1.test.gosuslugi.ru', () => {
            
            // вводим логин и пароль
            cy.get("[formcontrolname='login']").type("o.voronin2022@mail.ru")
            cy.get("[formcontrolname='password']").type("Pmi.2022.murm")
            cy.contains("Войти").click()
        })

        // проверка что открылся портал
        cy.contains("Телемедицинские заявки")

    }),
    it('Неуспешный вход на портал через ЕСИА', () => {

        cy.viewport(1920, 1080)
        cy.visit('/')

        // выбираем вариант входа через ЕСИА
        cy.get("[data-cy='esia-login']").click()

        // перенаправление на сайт ЕСИА
        cy.origin('https://esia-portal1.test.gosuslugi.ru', () => {
            
            // вводим логин и пароль
            cy.get("[formcontrolname='login']").type("test@mail.ru")
            cy.get("[formcontrolname='password']").type("123")
            cy.contains("Войти").click()

            // есть ошибка о неверных данных
            cy.contains("Неверные логин или пароль")

            // ввод корректных данных пользователя ЕСИА
            cy.get("[formcontrolname='login'] > input").clear().type("v.shishin@n3med.ru")
            cy.get("[formcontrolname='password'] > div > input").clear().type("ue9iEW!m64iaFJL")
            cy.contains("Войти").click()

        })

        // получение ошибки о закрытом доступе и возвращение на главную
        cy.contains("У вас нет активной учетной записи. Обратитесь к администратору вашей организации.")
        cy.get("[data-cy='back-to-main']").click()
        cy.contains("Вход на портал телемедицинских консультаций")

    })
  })