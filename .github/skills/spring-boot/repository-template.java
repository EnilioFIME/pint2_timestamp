package com.example.repository;

import com.example.entity.{{ClassName}};
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface {{ClassName}}Repository extends JpaRepository<{{ClassName}}, Long> {

    // Custom queries example

    @Query("SELECT e FROM {{ClassName}} e WHERE e.name LIKE %:name%")
    List<{{ClassName}}> findByNameContaining(@Param("name") String name);

    Optional<{{ClassName}}> findByName(String name);

    // Derived query methods
    // List<{{ClassName}}> findByStatus(String status);
    // List<{{ClassName}}> findByCreatedAtAfter(LocalDateTime date);
}
