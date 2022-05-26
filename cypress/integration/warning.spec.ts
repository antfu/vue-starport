context('warnings', () => {
  beforeEach(() => {
    cy.visit('/', {
      onBeforeLoad(win) {
        cy.stub(win.console, 'log').as('consoleLog')
        cy.stub(win.console, 'error').as('consoleError')
        cy.stub(win.console, 'warn').as('consoleWarn')
      },
    })
  })

  it('no-size', () => {
    cy.url()
      .should('eq', 'http://localhost:3000/')

    cy.get('.image-0 .my-component').should('exist')

    // navigate
    cy.get('#link-warning-no-size').click()
    // lift-off
    cy.get('.image-0 .my-component').should('not.exist')

    cy.url()
      .should('eq', 'http://localhost:3000/warning-no-size')

    cy.get('@consoleWarn').should('be.calledWith', '[Vue Starport] The proxy of component "MyComponent" (port "0") has no height on initial render, have you set the size for it?')
    cy.get('@consoleError').should('not.be.called')
  })

  it('port-conflict', () => {
    cy.url()
      .should('eq', 'http://localhost:3000/')

    cy.get('.image-0 .my-component').should('exist')

    // navigate
    cy.get('#link-warning-port-conflict').click()
    // lift-off
    cy.get('.image-0 .my-component').should('not.exist')

    cy.url()
      .should('eq', 'http://localhost:3000/warning-port-conflict')

    cy.get('@consoleWarn').should('not.be.called')
    cy.get('@consoleError').should('be.calledWith', '[Vue Starport] Multiple proxies of "MyComponent" with port "0" detected. The later one will be ignored.')
  })
})
