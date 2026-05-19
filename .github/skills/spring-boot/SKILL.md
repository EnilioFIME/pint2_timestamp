---
name: spring-boot
description: Use when: scaffolding Spring Boot entities, services, controllers, repositories, or adding JPA/REST endpoints with best practices and test support
---

# Spring Boot Development Skill

Assists with Spring Boot project tasks including entity generation, service layer scaffolding, REST controller creation, and repository setup with Spring Data JPA.

## Common Tasks

- **Generate Entity Classes**: Create JPA entities with proper annotations, relationships, and builder patterns
- **Service Layer**: Build service classes with business logic and dependency injection
- **REST Controllers**: Generate REST endpoints with proper mappings, validation, and error handling
- **Repositories**: Set up Spring Data JPA repositories with custom queries
- **Test Classes**: Generate unit and integration tests using JUnit 5 and Mockito
- **Database Configuration**: Update application properties for database connections

## Usage Examples

```
/spring-boot create entity for Project with fields: id, name, description, createdAt, updatedAt
/spring-boot generate service layer for User entity
/spring-boot add REST endpoints for Product management
/spring-boot create repository with custom finder methods
/spring-boot generate unit tests for OrderService
```

## Best Practices Enforced

- ✅ Use `@RequiredArgsConstructor` for constructor injection
- ✅ Apply `@Transactional` appropriately at service layer
- ✅ Separate concerns: entities, DTOs, services, repositories
- ✅ Add proper validation annotations (`@NotNull`, `@Valid`, etc.)
- ✅ Include meaningful exception handling and logging
- ✅ Use `@Builder` for entity construction in tests
- ✅ Follow camelCase naming; use `@Column(name = "snake_case")` for DB fields

## Project Structure

```
src/
├── main/
│   ├── java/com/example/
│   │   ├── entity/
│   │   ├── dto/
│   │   ├── repository/
│   │   ├── service/
│   │   ├── controller/
│   │   └── config/
│   └── resources/
│       ├── application.properties
│       └── db/migration/
└── test/
    └── java/com/example/
        ├── service/
        ├── controller/
        └── repository/
```

## Templates Available

### Entity Template
JPA entity with Lombok annotations, audit fields, builder pattern

### Service Template
Spring service with dependency injection, transactional operations, exception handling

### Controller Template
REST controller with request/response mapping, validation, error responses

### Repository Template
Spring Data JPA repository with custom query methods

### Test Template
Unit test class with Mockito mocks and assertions
