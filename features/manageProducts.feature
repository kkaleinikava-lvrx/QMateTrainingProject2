Feature: The Manage Products Fiori app

  Scenario Outline: Product Info Consistency
  Verify that product information displayed on the home page matches the corresponding information on the product details page.

    Given Open Manage Product app
    When Select product "<product_name>"
    Then Verify product details match data from product list

    Examples:
      | product_name                    |
      | Ikura                           |
      | Uncle Bob's Organic Dried Pears |

  Scenario Outline: Product Order Flow
  Verify that after ordering a product, its state is updated correctly in the application.
  
    Given Open Manage Product app
    When Order product "<product_name>"
    Then Verify Units in Stock for product "<product_name>" increased by 10
    And Verify product "<product_name>" is not in "Shortage" list
    And Verify product "<product_name>" is in "Plenty in Stock" list

    Examples:
      | product_name               |
      | Northwoods Cranberry Sauce |
      | Chai                       |

  Scenario Outline: Product Deletion
  Verify that deleting a product updates the product listings and counters correctly.
  
    Given Open Manage Product app
    When Remove product "<product_name>"
    Then Verify item count decreased by 1 for "All Products" list
    And Verify item count decreased by 1 for "<list_name>" list
    And Verify product "<product_name>" is not in "All Products" list
    And Verify product "<product_name>" is not in "Plenty in Stock" list
    And Verify product "<product_name>" is not in "Shortage" list
    And Verify product "<product_name>" is not in "Out of Stock" list
        
    Examples:
      | product_name                 | list_name       |
      | Schwarzwälder Kirschtorte    | Shortage        |
      | Alice Mutton                 | Plenty in Stock |

  Scenario Outline: Product Search
  Verify that searching for a product by name via the search field filters the results correctly.
  
    Given Open Manage Product app
    When Search for "<search_term>"
    Then Verify search results for "<search_term>"
        
    Examples:
      | search_term     |
      | Ch              |
      | Mishi Kobe Niku |
    