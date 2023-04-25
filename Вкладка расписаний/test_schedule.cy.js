describe('Работа с вкладками расписаний', () => {
  it('Создание врача, профиля, расписания и проверка фильтра поиска', () => {
    cy.viewport(1920, 1080)
    cy.visit('auth/')
    
    // вводим  данные пользователя
    cy.get("[type='text']").type("white@mail.ru")
    cy.get("[type='password']").type("123")

    cy.get(".button__primary").click()

    // открываем вкладку "Расписание и профили"
    cy.contains("РАСПИСАНИЕ И ПРОФИЛИ").click()

    // переходим ко вкладке "Врачи"
    cy.get("[data-cy='menu-practitioner']", {timeout: 5000}).click()
    
    // добавляем врача
    cy.contains("Добавить врача").click()
    cy.get("[data-cy='practitioner-snils'] > div > .gdfUhX").type('01069948355')
    cy.contains("ИСКАТЬ ВРАЧА", {timeout: 5000}).click()
    cy.contains("СОХРАНИТЬ", {timeout: 100000}).click()

    // проверяем фильтр ища созданного врача
    cy.get("[placeholder='Поиск']", {timeout: 100000}).type("Беляевский{enter}", {timeout: 100000})
    cy.get(".sc-bSGrXo.fSXFoF").should("contain", "Беляевский Евгений Борисович")

    //удаляем добавленное значение и проверяем что оно больше не находится
    cy.get("div:nth-child(1) > div.sc-cwhxAJ.boWLaY > div > svg").click()
    cy.contains("По запросу не нашлось результатов")

    // переходим ко вкладке "Профили"
    cy.get("[data-cy='menu-profile']").click()

    // создаем профиль заполняя его, в название передается неповторяющееся значение в миллисекундах
    cy.contains("ДОБАВИТЬ ПРОФИЛЬ").click()
    let ms = Date.now()
    let profile_name = "auto_profile" + ms

    // вводим имя
    cy.get("div:nth-child(3) > div > label > div:nth-child(2) > input").type(profile_name)

    // выбираем маршрут
    cy.get("div.css-2b097c-container > div > div.css-1vdkdsd > div.css-229dyb-singleValue").click()
    cy.get("[id$='option-0']").click()

    //атрибут возрастной категории граждан
    cy.get("div:nth-child(2) > div:nth-child(2) > div > label > div > div > div.css-1vdkdsd").click()
    cy.get("[id$='option-0']").click()

    // атрибут номенклатуры мед услуг
    cy.get("div:nth-child(3) > div:nth-child(2) > div > label > div > div > div.css-1vdkdsd", {timeout: 100000}).click()
    cy.get("[id$='option-0']", {timeout: 100000}).click()

    // атрибут составного профиля помощи
    cy.get("div:nth-child(4) > div:nth-child(2) > div > label > div > div > div.css-1vdkdsd").click()
    cy.get("[id$='option-0']").click()

    // атрибут типа предоставления услуги
    cy.get("div:nth-child(5) > div:nth-child(2) > div > label > div > div > div.css-1vdkdsd").click()
    cy.get("[id$='option-0']").click()

    cy.contains("СОХРАНИТЬ").click()
    cy.contains("Профиль " + profile_name + " сохранен")

    // проверям фильтр ища по названию созданный профиль
    cy.get("div:nth-child(2) > input").type(profile_name)
    cy.contains("ИСКАТЬ").click()

    // у найденного значения проверяем что название равно тому, что мы искали
    cy.get("div.sc-cWvMYY.feVQYu > div").should("contain", profile_name)

    // переходим на вкладку расписаний и создаем новое расписание
    cy.get("div.sc-qRumB.ehMjgb > div > div:nth-child(2) > div").click()
    cy.contains("ДОБАВИТЬ РАСПИСАНИЕ").click()

    // выбираем профиль
    cy.get("div:nth-child(2) > label > div.css-2b097c-container > div > div.css-1vdkdsd").click()
    cy.get("[id$='option-0']").click()

    // выбираем шаблон
    cy.get("div:nth-child(3) > label > div.css-2b097c-container > div > div.css-1vdkdsd").click()
    cy.get("[id$='option-0']").click()

    let d = new Date()
    let day = d.getDate().toString(), month = (d.getMonth() + 1).toString(), year = d.getFullYear().toString()
    if (month < 10){
      month = 0 + month
    }
    let date = year + "-" + month + "-" + day

    // вводим даты действия расписания
    cy.get("[data-cy='schedule-start'] > div >.cINcOw").type(date)
    cy.get("[data-cy='schedule-end'] > div >.cINcOw").type(date)

    // выбираем врача
    cy.get("[data-cy='schedule-practitioners'] > div > div > div:nth-child(1)").click()
    cy.get("[id$='option-0']").click()

    // сохраняем расписание
    cy.get("[data-cy='schedule-save']").click()
    cy.contains("Расписание сохранено", {timeout: 100000})

    // возвращаемся на страницу расписаний и фильтруем расписания по выбранному профилю
    cy.contains("Назад к списку").click()

    cy.get("div.sc-ehsgIH.hRmpRK.sc-qRumB.fECQIy.FilterForm > div:nth-child(1) > label > div.css-2b097c-container > div > div.css-1vdkdsd").click()
    cy.get("[id$='option-0']").click()

    cy.get("[data-cy='schedule-search']").click()
    cy.get("div.sc-bZPPFW.deEwFo > div.sc-cyRfQX.iUqHII > div").should("contain", "1_test_ui")

    // выходим с портала
    cy.get(".menu-exit", {timeout: 5000}).click()
    cy.contains("Вход на портал телемедицинских консультаций")
  })
})
