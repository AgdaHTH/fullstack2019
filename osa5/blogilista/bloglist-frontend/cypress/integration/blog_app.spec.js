describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Teiska Testeri',
      username: 'tester',
      password: 'hemlighet'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)

    cy.visit('http://localhost:3000')
  })


  it('login form is shown', function() {
    cy.contains('application')
    cy.contains('login')
  })

  it('login succeeds with correct credentials', function () {
    cy.get('#username').type('tester')
    cy.get('#password').type('hemlighet')
    cy.get('#login-button').click()

    cy.contains('Teiska Testeri logged in')
  })

  it('login fails with bad credentials', function () {
    cy.get('#username').type('tester')
    cy.get('#password').type('salaisuus')
    cy.get('#login-button').click()

    //cy.contains('wrong username or password')
    cy.get('.error').contains('wrong username or password')
    //cy.get('.error').should('contain', 'username or password')
    cy.get('html').should('not.contain', 'Teiska Testeri logged in')
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'tester', password: 'hemlighet' })
    })

    it('a blog can be created', function() {
      cy.contains('add blog').click()
      cy.get('#title').type('a test blog about cypress')
      cy.get('#author').type('testblogger')
      cy.get('#url').type('www.testblog.fi')
      cy.get('#add-button').click()
      cy.contains('a test blog about cypress')

    })

    describe('when a blog has been created', function() { 
      beforeEach(function () {
        cy.createBlog({
          title: 'a test blog about cypress',
          author: 'testblogger',
          url: 'www.testblog.fi'
        })
      })
      it('a blog can be liked', function () {
        cy.contains('a test blog about cypress').contains('view').click()
        cy.contains('a test blog about cypress').contains('0')
        cy.contains('a test blog about cypress').contains('like').click()
        cy.contains('a test blog about cypress').contains('1')
      })
      it('a blog can be deleted', function () {
        cy.contains('a test blog about cypress').contains('view').click()
        cy.contains('a test blog about cypress').contains('remove').click()
        cy.get('html').should('not.contain', 'a test blog about cypress')
      })

      /*
      it('then example', function() {
        cy.get('button').then( buttons => {
        console.log('number of buttons', buttons.length)
        cy.wrap(buttons[0]).click()
        })
      })
      */
    })
  })
})