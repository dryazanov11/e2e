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
    cy.get("[data-cy='practitioner-snils'] > div > input").type('01069948355')
    cy.contains("ИСКАТЬ ВРАЧА", {timeout: 5000}).click()
    cy.contains("СОХРАНИТЬ", {timeout: 100000}).click()

    // проверяем фильтр ища созданного врача
    cy.get("[placeholder='Поиск']", {timeout: 100000}).type("Беляевский{enter}", {timeout: 100000})
    cy.get("[data-cy='doctor-name-0']").should("contain", "Беляевский Евгений Борисович")

    //удаляем добавленное значение и проверяем что оно больше не находится
    cy.get("[data-cy='remove-practitioner']", {timeout: 5000}).click()
    cy.contains("По запросу не нашлось результатов")

    // переходим ко вкладке "Профили"
    cy.get("[data-cy='menu-profile']").click()

    // создаем профиль заполняя его, в название передается неповторяющееся значение в миллисекундах
    cy.contains("ДОБАВИТЬ ПРОФИЛЬ").click()
    let ms = Date.now()
    let profile_name = "auto_profile" + ms

    // вводим имя
    cy.get("[data-cy='profile-name'] > div > input").type(profile_name)

    // выбираем маршрут
    cy.get("[data-cy='profile-workflow'] > div > div").click()
    cy.get("[id$='option-0']").click()

    //атрибут возрастной категории граждан
    cy.get("[data-cy='row-multi-select-1.2.643.2.69.1.1.1.223']").click()
    cy.get("[id$='option-0']").click()

    // атрибут номенклатуры мед услуг
    cy.get("[data-cy='row-multi-select-1.2.643.5.1.13.13.11.1070']", {timeout: 100000}).click()
    cy.get("[id$='option-0']", {timeout: 100000}).click()

    // атрибут составного профиля помощи
    cy.get("[data-cy='row-multi-select-1.2.643.2.69.1.1.1.56']").click()
    cy.get("[id$='option-0']").click()

    // атрибут типа предоставления услуги
    cy.get("[data-cy='attribute-1.2.643.2.69.1.1.1.182.32']").click()
    cy.get("[id$='option-0']").click()

    cy.contains("СОХРАНИТЬ").click()
    cy.contains("Профиль " + profile_name + " сохранен")

    // проверям фильтр ища по названию созданный профиль
    cy.get("[data-cy='profile-filter-name'] > div > input").type(profile_name)
    cy.contains("ИСКАТЬ").click()

    // у найденного значения проверяем что название равно тому, что мы искали
    cy.get("[data-cy='profile-name-0']").should("contain", profile_name)

    // проверяем на созданном профиле блокировку
    cy.get("[data-cy='profile-change-status-0']").click()
    cy.contains("Заблокировано")
    cy.get("[data-cy='profile-change-status-0']").click()
    cy.contains("Активно")

    // переходим на вкладку расписаний и создаем новое расписание
    cy.get("#TMSchedule-container > div > div > div > div > [data-cy='menu-schedule']").click()
    cy.contains("ДОБАВИТЬ РАСПИСАНИЕ").click()

    // выбираем профиль
    cy.get("[data-cy='schedule-profile'] > div > div").click()
    cy.get("[id$='option-0']").click()

    // выбираем шаблон
    cy.get("[data-cy='schedule-template'] > div > div").click()
    cy.get("[id$='option-0']").click()

    let d = new Date()
    let day = d.getDate().toString(), month = (d.getMonth() + 1).toString(), year = d.getFullYear().toString()
    if (month < 10){
      month = 0 + month
    }
    let date = year + "-" + month + "-" + day

    // вводим даты действия расписания
    cy.get("[data-cy='schedule-start'] > div > input").type(date)
    cy.get("[data-cy='schedule-end'] > div >input").type(date)

    // выбираем врача
    cy.get("[data-cy='schedule-practitioners'] > div > div").click()
    cy.get("[id$='option-0']").click()

    // сохраняем расписание
    cy.get("[data-cy='schedule-save']").click()
    cy.contains("Расписание сохранено", {timeout: 100000})

    // возвращаемся на страницу расписаний и фильтруем расписания по выбранному профилю
    cy.contains("Назад к списку").click()

    cy.get("[data-cy='schedule-filter-profile'] > div > div").click()
    cy.get("[id$='option-0']").click()

    cy.get("[data-cy='schedule-search']").click()
    cy.get("[data-cy^='schedule-name']").should("contain", "1_test_ui")

    // выходим с портала
    cy.get(".menu-exit", {timeout: 5000}).click()
    cy.contains("Вход на портал телемедицинских консультаций")
  })
})
