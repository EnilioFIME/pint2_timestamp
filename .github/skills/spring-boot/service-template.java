package com.example.service;

import com.example.entity.{{ClassName}};
import com.example.repository.{{ClassName}}Repository;
import com.example.dto.{{ClassName}}DTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class {{ClassName}}Service {

    private final {{ClassName}}Repository repository;

    @Transactional(readOnly = true)
    public List<{{ClassName}}DTO> getAll() {
        log.info("Fetching all {{classNameLower}}");
        return repository.findAll()
            .stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public {{ClassName}}DTO getById(Long id) {
        log.info("Fetching {{classNameLower}} with id: {}", id);
        return repository.findById(id)
            .map(this::toDTO)
            .orElseThrow(() -> new ResourceNotFoundException("{{ClassName}} not found with id: " + id));
    }

    public {{ClassName}}DTO create({{ClassName}}DTO dto) {
        log.info("Creating new {{classNameLower}}");
        {{ClassName}} entity = toEntity(dto);
        {{ClassName}} saved = repository.save(entity);
        return toDTO(saved);
    }

    public {{ClassName}}DTO update(Long id, {{ClassName}}DTO dto) {
        log.info("Updating {{classNameLower}} with id: {}", id);
        {{ClassName}} entity = repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("{{ClassName}} not found with id: " + id));

        // Update fields
        {{ClassName}} updated = repository.save(entity);
        return toDTO(updated);
    }

    public void delete(Long id) {
        log.info("Deleting {{classNameLower}} with id: {}", id);
        repository.deleteById(id);
    }

    private {{ClassName}}DTO toDTO({{ClassName}} entity) {
        return {{ClassName}}DTO.builder()
            .id(entity.getId())
            .build();
    }

    private {{ClassName}} toEntity({{ClassName}}DTO dto) {
        return {{ClassName}}.builder()
            .build();
    }
}
