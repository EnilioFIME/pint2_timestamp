package com.example.service;

import com.example.entity.{{ClassName}};
import com.example.repository.{{ClassName}}Repository;
import com.example.dto.{{ClassName}}DTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@DisplayName("{{ClassName}}Service Tests")
class {{ClassName}}ServiceTest {

    @Mock
    private {{ClassName}}Repository repository;

    @InjectMocks
    private {{ClassName}}Service service;

    private {{ClassName}} test{{ClassName}};
    private {{ClassName}}DTO test{{ClassName}}DTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        test{{ClassName}} = {{ClassName}}.builder()
            .id(1L)
            .build();

        test{{ClassName}}DTO = {{ClassName}}DTO.builder()
            .id(1L)
            .build();
    }

    @Test
    @DisplayName("Should create a new {{classNameLower}}")
    void testCreate() {
        when(repository.save(any({{ClassName}}.class))).thenReturn(test{{ClassName}});

        {{ClassName}}DTO result = service.create(test{{ClassName}}DTO);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(repository, times(1)).save(any({{ClassName}}.class));
    }

    @Test
    @DisplayName("Should retrieve {{classNameLower}} by ID")
    void testGetById() {
        when(repository.findById(1L)).thenReturn(java.util.Optional.of(test{{ClassName}}));

        {{ClassName}}DTO result = service.getById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(repository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Should throw exception when {{classNameLower}} not found")
    void testGetByIdNotFound() {
        when(repository.findById(999L)).thenReturn(java.util.Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.getById(999L));
    }

    @Test
    @DisplayName("Should delete {{classNameLower}}")
    void testDelete() {
        service.delete(1L);

        verify(repository, times(1)).deleteById(1L);
    }
}
