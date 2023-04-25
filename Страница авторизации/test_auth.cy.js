describe('Валидация при входе на портал', () => {
    it('Некорректный ввод данных при авторизации', () => {

        cy.viewport(1920, 1080)
        cy.visit('/')
      
    //  вводим неверные данные
        cy.get("[type='text']").type('example@example.com')
        cy.get("[type='password']").type('123')
  
        cy.get(".button__primary").click()

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

    })
  })