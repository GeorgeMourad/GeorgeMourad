package com.email.Email.repository;

import com.email.Email.model.Template;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface TemplateRepository extends JpaRepository<Template,Integer>{
    List<Template> findBySubjectContainingIgnoreCase(String subject);
}
