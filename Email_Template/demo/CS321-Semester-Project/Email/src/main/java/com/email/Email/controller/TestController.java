package com.email.Email.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;




@RestController
public class TestController {
    
    @GetMapping("/Person")
    public Person getPerson() {
        Person p = new Person();
        p.setAge(10);
        p.setName("Bobby Marley");
        return p;
    }
    

}

class Person{

    private String name;
    private int age;

    public void setName(String name) {
        this.name = name;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }

}
