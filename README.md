# Customer Mobile App Tutorial
## Pre-requisites
### Ionic (and Cordova)
1.  Register for an Ionic ID / Account: https://apps.ionic.io/signup
2.  Download and install the Ionic LAB: http://lab.ionic.io/
3.  Install the Ionic View App on your Android or iOS powered Smartphone or Tablet: http://view.ionic.io/

### API Development
1.  (optional) Download and install Postman (for Windows you need Chrome): https://www.getpostman.com/

### Java EE
1.  WildFly Application server.
    - Including the JDBC MySQL Driver installed and configured.
2.  NetBeans IDE (EE Edition).
3.  A running MySQL Database instance.

## Java EE (JPA and EJB) and JAX-RS (REST) API
1.  Create a new Maven-based Web Project (running on WildFly)

2.  Create a persistence.xml file containing your data source link, such as: 
    ````
    java:/jboss/datasources/MySQLDS
    ````
    
3.  Create an Customer Entity Class for storing customer data, such as:
    ````java
    @Entity
    @XmlRootElement //optional
    public class Customer implements Serializable {
    
        private static final long serialVersionUID = 1L;
        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        private Long id;
        private String name;
        private String email;
        private String mobile;
        // getters and setters
    }
    ````
    
4.  Create a CustomerEJB Class containing CRUD operations for the customer entity:
    ````java
    @Stateless
    public class CustomerEJB {
    
        @PersistenceContext(unitName = "primary")
        private EntityManager em;
    
        public List<Customer> findCustomers() {
            CriteriaQuery<Customer> criteria = em.getCriteriaBuilder().createQuery(Customer.class);
            criteria.select(criteria.from(Customer.class));
            return em.createQuery(criteria).getResultList();
        }
    
        public Customer findCustomerById(Long id) {
            return em.find(Customer.class, id);
        }
    
        public Customer createCustomer(Customer customer) {
            em.persist(customer);
            return customer;
        }
    
        public void deleteCustomer(Customer customer) {
            em.remove(customer);
        }
    
        public Customer updateCustomer(Customer customer) {
            return em.merge(customer);
        }
    }
    ````
    
5.  Create a RESTful API by writing a CustomerEndpoint Class:
    ````java
    @Stateless
    @Path("v1/customer")
    public class CustomerEndpoint {
    
        @EJB
        private CustomerEJB customerEJB;
    
        @POST
        @Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
        public void create(Customer entity) {
            customerEJB.createCustomer(entity);
        }
    
        @PUT
        @Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
        public void edit(Customer entity) {
            customerEJB.updateCustomer(entity);
        }
    
        @DELETE
        @Path("{id}")
        public void remove(@PathParam("id") Long id) {
            customerEJB.deleteCustomer(customerEJB.findCustomerById(id));
        }
    
        @GET
        @Path("{id}")
        @Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
        public Customer find(@PathParam("id") Long id) {
            return customerEJB.findCustomerById(id);
        }
    
        @GET
        @Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
        public List<Customer> findAll() {
            return customerEJB.findCustomers();
        }
        
    }
    ````
    
6.  Use NetBeans to "Configure REST using Java EE 6 specification" to automatically generate an ApplicationConfig. Please define the application Path as follows.
    ````java
    @javax.ws.rs.ApplicationPath("api")
    public class ApplicationConfig extends Application {
      // generated code
    }
    ````
    
7.  (optional for development purposes) Implement a CORS<sup id="f1r">[1](#f1)</sup> filter as follows:
    ````java
    @Provider
    public class CORSFilter implements ContainerResponseFilter{
    
        @Override
        public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext) throws IOException {
            responseContext.getHeaders().add("Access-Control-Allow-Origin", "*");
            // the following code is optional
            responseContext.getHeaders().add("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
            String requestheader = requestContext.getHeaderString("Access-Control-Request-Headers");
            if (requestheader != null && !"".equals(requestheader)) {
                responseContext.getHeaders().putSingle("Access-Control-Allow-Headers", requestheader);
            }
            responseContext.getHeaders().add("Access-Control-Max-Age", "86400");
        }
    }
    ````
    
8.  Run the API on your local WildFly server for development.
    - You may test your API with Postman: http://localhost:8080/CustomerMobileAPI-1.0/api/v1/customer
    - There is also Cloud-based API version accessible under: http://api-andreasmartin.rhcloud.com/api/v1/customer
    
## Ionic App Prototyping
We are going to use the Ionic Creator prototyping tool to create our development-ready HTML5 code.
1.  Go to 
http://ionic.io/products/creator
    
![](doc/img/2016-12-05_19h21_20.png)
![](doc/img/2016-12-05_19h22_45.png)

![](doc/img/2016-12-05_19h24_48.png)
![](doc/img/2016-12-05_19h25_35.png)

## Project creation
Project creation using Ionic Lab and Ionic Creator files...
1.  Externalize the CSS code
    ```html
    <link href="css/style.css" rel="stylesheet">
    ```
## Services
1.  The starter.services module you just created has a dependency on the Angular resource module which is not included by default. Open index.html and add a script tag to include angular-resource.min.js (right after ionic-bundle.js):
    ```html
    <script src="lib/ionic/js/angular/angular-resource.min.js"></script>
    ```
2.  Implement two service factories
    ```javascript
      .constant('ApiEndpoint', {
        url: 'http://api-andreasmartin.rhcloud.com/api'
      })
    
      .factory('CustomersFactory', function ($resource) {
        return $resource(ApiEndpoint.url + '/v1/customer', {}, {
          query: {method: 'GET', isArray: true},
          update: {method: 'PUT'},
          create: {method: 'POST'}
        })
      })
    
      .factory('CustomerFactory', function ($resource) {
        return $resource(ApiEndpoint.url + '/v1/customer/:id', {}, {
          show: {method: 'GET'},
          delete: {method: 'DELETE', params: {id: '@id'}}
        })
      });
    ```
## Controllers
1.  Implement controllers

## Footnotes
<b id="f1">1:</b> HTTP access control (CORS): https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS [↩](#f1r)
