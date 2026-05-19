# Spring Boot Skill

Workspace skill for scaffolding and managing Spring Boot components with best practices.

## Files

- **SKILL.md** - Skill definition and documentation
- **entity-template.java** - JPA entity template with Lombok, audit fields, and lifecycle hooks
- **service-template.java** - Service layer template with dependency injection and transactional operations
- **repository-template.java** - Spring Data JPA repository interface with custom queries
- **service-test-template.java** - JUnit 5 + Mockito test template for services

## How to Use

1. Invoke the skill in Claude Code chat: `/spring-boot`
2. Specify your task (e.g., "create entity for Project")
3. Provide field names, relationships, or requirements
4. Templates are used as reference for code generation

## Key Conventions

- **Package Structure**: `entity`, `dto`, `service`, `repository`, `controller`, `config`
- **Naming**: CamelCase for Java classes, snake_case for database columns
- **Dependency Injection**: Constructor injection with `@RequiredArgsConstructor`
- **Transactions**: Service layer operations marked with `@Transactional`
- **Validation**: Use Jakarta/Bean Validation annotations (`@NotNull`, `@Valid`, etc.)
- **Logging**: Use Lombok's `@Slf4j` for logger injection
- **Audit Fields**: All entities include `createdAt` and `updatedAt` timestamps

## Extending

To add more templates:
1. Create new `.java` files in this directory
2. Update `SKILL.md` with new template descriptions
3. Use placeholder syntax `{{ClassName}}`, `{{classNameLower}}`, etc.
