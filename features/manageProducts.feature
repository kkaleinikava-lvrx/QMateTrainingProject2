Feature: The Manage Products Fiori app

  Scenario Outline: Product Info Consistency
  Verify that product information displayed on the home page matches the corresponding information on the product details page.

    Given Open Manage Product app
    When Select product "<product_name>"
    Then Verify product details match data from product list

    Examples:
      | product_name |
      |  |
      |  |

  Scenario Outline: Product Order Flow
  Verify that after ordering a product, its state is updated correctly in the application.
  
    Given Open Manage Product app
    When Order product "<product_name>"
    Then Verify Units in Stock for product "<product_name>"
    And Verify product "<product_name>" is not in "Shortage" list
    And Verify product "<product_name>" is in "Plenty in Stock" list

    Examples:
      | product_name |
      |  |
      |  |

  Scenario Outline: Product Deletion
  Verify that deleting a product updates the product listings and counters correctly.
  
    Given Open Manage Product app
    When Remove product "<product_name>"
    Then Verify item counts for all lists
    And Verify product "<product_name>" is not in any list
        
    Examples:
      | product_name |
      |  |
      |  |

  Scenario Outline: Product Search
  Verify that searching for a product by name via the search field filters the results correctly.
  
    Given Open Manage Product app
    When Search for "<search_term>"
    Then Verify search results
        
    Examples:
      | search_term |
      |  |
      |  |
    