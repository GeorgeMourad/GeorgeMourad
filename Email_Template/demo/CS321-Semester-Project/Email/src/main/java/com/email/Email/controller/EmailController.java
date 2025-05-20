package com.email.Email.controller;

import com.email.Email.model.User;
import com.email.Email.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;




@RestController
public class EmailController {

    @Autowired
    UserRepository UserRepository;

    private final UserService userService;

    public EmailController(UserService userService){
        this.userService = userService;
    }

    @RequestMapping("/")
    public ModelAndView home(){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("html/login.html");
        return modelAndView;
    }

    @RequestMapping("/test")
    public ModelAndView test(){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("html/test.html");
        return modelAndView;
    }

    @RequestMapping("/explore")
    public ModelAndView explore(){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("html/explore.html");
        return modelAndView;
    }

    @PostMapping("/login-user")
    public List<User> loginUser(@RequestBody @Validated User user){
        return userService.findUserByExample(user);
    }

    @GetMapping("/get-all-users")
    public List<User> getAllUsers(){
        return UserRepository.findAll();
    }

    @GetMapping("/get-user/{id}")
    public User getUser(@PathVariable("id") Integer id) {
        return UserRepository.findById(id).get();
    }
    
    @DeleteMapping("/remove/{id}")
    public boolean deleteRow(@PathVariable("id") Integer id){
        if(!UserRepository.findById(id).equals(Optional.empty())){
            UserRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @PutMapping("update/{id}")
    public User updateUser(@PathVariable("id") Integer id,
                             @RequestBody Map<String, String> body) {
        User current = UserRepository.findById(id).get();
        current.setUsername(body.get("username"));
        current.setPassword(body.get("password"));
        UserRepository.save(current);

        return current;
    }

    @PostMapping("/add")
    public List<User> createUser(@RequestBody @Validated User user) {
        return userService.createUser(user);
    }
    
}