package com.email.Email.controller;

import com.email.Email.model.Template;
import com.email.Email.repository.TemplateRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;


@RestController
public class TemplateController {

    @Autowired
    TemplateRepository TemplateRepository;

    private final TemplateService templateService;

    public TemplateController(TemplateService templateService){
        this.templateService = templateService;
    }

    @RequestMapping("/template")
    public ModelAndView createTemplates(){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("html/template.html");
        return modelAndView;
    }

    @PostMapping("/create")
    public Template createTemplate(@RequestBody @Validated Template template) {
        TemplateRepository.save(template);
        return template;
    }

    @DeleteMapping("/delete/{tid}")
    public boolean deleteTemplate(@PathVariable("tid") Integer tid){
        if(!TemplateRepository.findById(tid).equals(Optional.empty())){
            TemplateRepository.deleteById(tid);
            return true;
        }
        return false;
    }

    @GetMapping("/get-all-templates")
    public List<Template> getTemplates(){
        return TemplateRepository.findAll();
    }

    @GetMapping("/get-template/{tid}")
    public Template getTemplate(@PathVariable("tid") Integer tid){
        return TemplateRepository.findById(tid).get();
    }

    @GetMapping("/search-templates/{subject}")
    public List<Template> searchTemplates(@PathVariable("subject") String subject){
        return templateService.searchTemplateByExample(subject);
    }

}
