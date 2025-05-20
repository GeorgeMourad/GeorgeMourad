package com.email.Email.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.email.Email.model.Template;

import com.email.Email.repository.TemplateRepository;


@Service
public class TemplateService {
    
    @Autowired
    TemplateRepository TemplateRepository;

    public List<Template> searchTemplateByExample(String subject){
        return TemplateRepository.findBySubjectContainingIgnoreCase(subject);
    }

}
