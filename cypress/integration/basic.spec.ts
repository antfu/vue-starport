context('Basic', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('basic nav', () => {
    cy.url()
      .should('eq', 'http://localhost:3000/')

    cy.get('.image-0 .the-component').should('exist')
    cy.get('.image-1 .the-component').should('exist')
    cy.get('.image-2 .the-component').should('exist')

    // navigate
    cy.get('.image-0').click()
    // lift-off
    cy.get('.image-0 .the-component').should('not.exist')

    cy.url()
      .should('eq', 'http://localhost:3000/0')

    // flying
    cy.get('.circle-0 .the-component').should('not.exist')

    cy.wait(800)

    // landed
    cy.get('.circle-0 .the-component').should('exist')

    // back
    cy.get('.back-btn').click()
    // lift-off
    cy.get('.circle-0 .the-component').should('not.exist')

    cy.url()
      .should('eq', 'http://localhost:3000/')
    // flying
    cy.get('.image-0 .the-component').should('not.exist')

    // not moving
    cy.get('.image-2 .the-component').should('exist')

    cy.wait(800)
    // landed
    cy.get('.image-0 .the-component').should('exist')
  })
})
