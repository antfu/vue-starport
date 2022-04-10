import type Sinon from 'cypress/types/sinon'

context('Basic', () => {
  it('from index', () => {
    cy.visit('/', {
      onBeforeLoad(win) {
        cy.stub(win.console, 'log').as('consoleLog')
        cy.stub(win.console, 'error').as('consoleError')
        cy.stub(win.console, 'warn').as('consoleWarn')
      },
    })

    cy.url()
      .should('eq', 'http://localhost:3000/')

    cy.get('.image-0 .my-component').should('exist')
    cy.get('.image-1 .my-component').should('exist')
    cy.get('.image-2 .my-component').should('exist')

    // navigate
    cy.get('.image-0').click()
    // lift-off
    cy.get('.image-0 .my-component').should('not.exist')

    cy.url()
      .should('eq', 'http://localhost:3000/0')

    // flying
    cy.get('.circle-0 .my-component').should('not.exist')

    cy.wait(800)

    // landed
    cy.get('.circle-0 .my-component').should('exist')

    // back
    cy.get('.back-btn').click()
    // lift-off
    cy.get('.circle-0 .my-component').should('not.exist')

    cy.url()
      .should('eq', 'http://localhost:3000/')
    // flying
    cy.get('.image-0 .my-component').should('not.exist')

    // not moving
    cy.get('.image-2 .my-component').should('exist')

    cy.wait(800)
    // landed
    cy.get('.image-0 .my-component').should('exist')

    cy.get('@consoleLog').should((_v) => {
      const v = _v as any as Sinon.SinonStub
      const calls = v.args.map(i => i[0])
      expect(calls.filter(i => i === 'MyComponent Mounted')).to.have.length(12)
    })
    cy.get('@consoleError').should('not.be.called')
    cy.get('@consoleWarn').should('not.be.called')
  })

  it('backward', () => {
    cy.visit('/0', {
      onBeforeLoad(win) {
        cy.stub(win.console, 'log').as('consoleLog')
        cy.stub(win.console, 'error').as('consoleError')
        cy.stub(win.console, 'warn').as('consoleWarn')
      },
    })

    cy.url()
      .should('eq', 'http://localhost:3000/0')

    cy.get('@consoleLog').should((_v) => {
      const v = _v as any as Sinon.SinonStub
      const calls = v.args.map(i => i[0])
      expect(calls.filter(i => i === 'MyComponent Mounted')).to.have.length(2)
    })

    cy.get('.circle-0 .my-component').should('exist')
    cy.get('.circle-1 .my-component').should('exist')

    // back
    cy.get('.back-btn').click()
    // lift-off
    cy.get('.circle-0 .my-component').should('not.exist')

    cy.url()
      .should('eq', 'http://localhost:3000/')
    // flying
    cy.get('.image-0 .my-component').should('not.exist')

    // not moving
    cy.get('.image-2 .my-component').should('exist')

    cy.wait(800)
    // landed
    cy.get('.image-0 .my-component').should('exist')

    cy.get('@consoleLog').should((_v) => {
      const v = _v as any as Sinon.SinonStub
      const calls = v.args.map(i => i[0])
      expect(calls.filter(i => i === 'MyComponent Mounted')).to.have.length(12)
    })
    cy.get('@consoleError').should('not.be.called')
    cy.get('@consoleWarn').should('not.be.called')
  })
})
