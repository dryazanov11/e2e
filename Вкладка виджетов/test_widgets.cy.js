describe('Работа с вкладкой виджетов', () => {
    it('Создание заявки и проверка фильтра заявок', () => {

        cy.viewport(1920, 1080)
        cy.visit('auth/')
        cy.once('uncaught:exception', () => false)
      
        // вводим  данные пользователя
        cy.get("[type='text']").type("white@mail.ru")
        cy.get("[type='password']").type("123")

        cy.get("[data-cy='submit-login-form']").click()

        // проверяем, что идет полное отображение данных (по умолчанию установлено именно оно)
        cy.get(".card__status-date").should("contain", "Создано")
        
        // открываем блок с доп фильтрами и делаем отображение компактным
        cy.get(".filter-process__additional__head-title").click()
        cy.contains("Отображать компактно").click()
        
        // проверка что нет лишних данных при такой настройке
        cy.get('.card__status-date').should('not.exist')

        // переходим к выбору маршрута для создания заявки
        cy.get("[data-cy='start-process']").click()
        cy.get("div.tm-arrow__container > span:nth-child(4)").click()
        cy.contains("Autotest_workflow").click()

        // заполняем заявку указав пациента и выбрав МО
        cy.get(".patient-MPI__search-button").click()
        cy.get(".patient-MPI__container > div:nth-child(1) > input").type("11122233344")
        cy.get(".patient-MPI__search-button").click()
        cy.contains("Банько Елена Игоревна", {timeout: 100000}).click()
        cy.get(".patient-MPI__search-button").click()
        cy.contains("Изменить")
        cy.get("[data-cy='input-serviceRequest.requesterOrganization']").type("6c34dc18-cab0-4e53-aba8-cea197f0ab5e{enter}")
        cy.get("[data-cy='input-serviceRequest.healthCareService']").type("4fb5b7e0-e1a4-4965-b91d-63a77bfbb4b8{enter}")

        // сохраняем заявку
        cy.contains("Сохранить").click()

        // проверяем вывод сообщения о незаполненном параметре
        cy.contains("Заполните обязательные поля")
        cy.get(".form-input__title_error")

        // дозаполняем заявку
        cy.get("[data-cy='input-serviceRequest.сomplaints']").type("жалоба")
        cy.contains("Сохранить").click()
        cy.contains("Операции", {timeout: 100000})

        // var node = document.querySelector('.card__number')
        // console.log(node)
        // var tm_id  = node[0].innerText
        
        // let tm_id
        // const tm_id = document.querySelector('.card__number').innerText
        // cy.document().then((doc) => {
        //    tm_id = doc.querySelector('.card__number').innerText
        //  })
        // cy.contains(tm_id)

        // переводим в следующий статус загрузив файл
        cy.contains("To Status 2").click()
        cy.get(".array-list__add").click()
        cy.get(".form-fileXDS__button").selectFile("C:/Users/User/cypress/cypress/autotest_file.txt")
        cy.contains("Файл autotest_file загружен")
        cy.contains("Сохранить").click()

        // проверяем что заявка сменила статус и загруженный файл отображается на карточке заявки
        cy.contains("В текущем статусе нет доступных операций", {timeout: 100000})
        cy.contains("Status 2", {timeout: 100000})
        cy.contains("autotest_file")

    })
  })