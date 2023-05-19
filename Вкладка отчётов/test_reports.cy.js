describe('Проверка вкладки отчётов', () => {
    it('Вход под ролью админа организации', () => {

        cy.viewport(1920, 1080)
        cy.visit('auth/')
        cy.once('uncaught:exception', () => false)
      
        // вводим данные
        cy.get("[type='text']").type('white@mail.ru')
        cy.get("[type='password']").type('123')
  
        cy.get("[data-cy='submit-login-form']").click()

        // переходим на вкладку отчётов
        cy.get("[for='check']", {timeout: 5000}).click()
        cy.contains("ОТЧЁТЫ")
        cy.visit('reports/')
        
        // выбираем агрегированный отчёт
        cy.contains("Aggregate report", {timeout: 20000})
        cy.visit("report/tm/68b2ec93-6401-49da-8362-8d22e0ebfd2b/aggregate/f9f4e1bc-54d5-4017-91e1-b247079c0315", {timeout: 5000})
        
        // проверяем что в нем есть данные
        cy.contains("Не указано", {timeout: 20000})
        cy.get(".total__count").should('not.have.text', '0').and('not.have.text', '1')

        // фильтруем данные по колопроктологии, код 100 в справочнике 1.2.643.2.69.1.1.1.56
        cy.get(".drop-arrow").click()
        cy.get("[data-cy='nsi_code_col_xgszljhuopekb2phviq'] > div > input").type("100")
        cy.get("[data-cy='nsi_code_col_xgszljhuopekb2phviq'] > div > div").click()
        cy.get("[data-cy='nsi_code_col_xgszljhuopekb2phviq-sign']").click()
        cy.get("[data-cy='option-0']").click()
        cy.contains("Получить данные").click()

        // проверяем что в отчёте данные по фильтру и скачиваем его - не забыть открыть файл и глянуть что там данные по фильтру
        cy.get(".total__count").should("contain", "1")
        cy.contains("Колопроктология")
        cy.get("[data-cy='aggregate-report-download']", {timeout: 5000}).click()

        // переходим к отчёту по заявкам
        cy.get("[data-cy='to-reports']").click()
        cy.get(".system-tab_selected").should("contain", "Телемедицинские заявки")
        cy.contains("Application report")
        cy.visit("report/tm/68b2ec93-6401-49da-8362-8d22e0ebfd2b/common/30d8d2df-336e-4cc7-93b1-bbad875bf7a6", {timeout: 5000})

        // проверяем что в нем есть данные и фильтруем по колонке "Имя текущего статуса"
        cy.get(".total__count").should('not.have.text', '0')
        cy.get(".drop-arrow").click()
        cy.get("[data-cy='status_name'] > div > input").type("Первый статус")
        cy.get("[data-cy='status_name'] > div > div").click()
        cy.contains("Получить данные").click()

        // проверяем что в отчёте данные по фильтру и скачиваем его - не забыть открыть файл и глянуть что там данные по фильтру
        cy.get("tr > td:nth-child(3)").should("contain", "Первый статус")
        cy.get("[data-cy='common-report-download']", {timeout: 5000}).click()

    }),
    it('Вход под ролью регионального админа', () => {

        cy.viewport(1920, 1080)
        cy.visit('auth/')
        cy.once('uncaught:exception', () => false)

        // вводим данные
        cy.get("[type='text']").type('reg_admin@test.com')
        cy.get("[type='password']").type('123')

        cy.get("[data-cy='submit-login-form']").click()

        // переходим на вкладку отчётов
        cy.get("[for='check']", {timeout: 5000}).click()
        cy.contains("ОТЧЁТЫ")
        cy.visit('reports/')
        
        // выбираем агрегированный отчёт
        cy.contains("QA-aggregate report", {timeout: 20000})
        cy.visit("report/tm/68b2ec93-6401-49da-8362-8d22e0ebfd2b/aggregate/89c876df-8885-4068-8214-6e93dcb15978", {timeout: 5000})
        
        // проверяем что в нем есть данные
        cy.contains("Не указано", {timeout: 20000})
        cy.get(".total__count").should('not.have.text', '0').and('not.have.text', '1')

        // фильтруем данные по нейрохирургии, код 40 в справочнике 1.2.643.2.69.1.1.1.56
        cy.get(".drop-arrow").click()
        cy.get("[data-cy='nsi_code_col_xgszljhuopekb2phviq'] > div > input").type("40")
        cy.get("[data-cy='nsi_code_col_xgszljhuopekb2phviq'] > div > div").click()
        cy.get("[data-cy='nsi_code_col_xgszljhuopekb2phviq-sign']").click()
        cy.get("[data-cy='option-0']").click()
        cy.contains("Получить данные").click()

        // проверяем что в отчёте данные по фильтру и скачиваем его - не забыть открыть файл и глянуть что там данные по фильтру
        cy.get(".total__count", {timeout: 20000}).should("contain", "1")
        cy.contains("Санкт-Петербургское государственное бюджетное учреждение здравоохранения \"Городская Александровская больница\"")
        cy.get("[data-cy='aggregate-report-download']", {timeout: 5000}).click()

        // переходим к отчёту по заявкам
        cy.get("[data-cy='to-reports']").click()
        cy.get(".system-tab_selected").should("contain", "Телемедицинские заявки")
        cy.contains("QA report")
        cy.visit("report/tm/68b2ec93-6401-49da-8362-8d22e0ebfd2b/common/a819cbe4-41ee-462c-a2ac-f42c67bbe7d4", {timeout: 5000})

        // проверяем что в нем есть данные и фильтруем по колонке "Имя текущего статуса"
        cy.get(".total__count").should('not.have.text', '0')
        cy.get(".drop-arrow").click()
        cy.get("[data-cy='status_name'] > div > input").type("Черновик")
        cy.get("[data-cy='status_name'] > div > div").click()
        cy.contains("Получить данные").click()

        // проверяем что в отчёте данные по фильтру и скачиваем его - не забыть открыть файл и глянуть что там данные по фильтру
        cy.get("tr > td:nth-child(5)").should("contain", "Черновик")
        cy.get("[data-cy='common-report-download']", {timeout: 5000}).click()

        // добавляем новый фильтр чтобы данные не были найдены
        cy.get("[data-cy='business_status_code'] > div > input").type("99")
        cy.get("[data-cy='business_status_code'] > div > div").click()
        cy.contains("Получить данные").click()
        cy.get(".total__count", {timeout: 20000}).should("contain", "0")

    })
  })