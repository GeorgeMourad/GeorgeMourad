package com.email.Email.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.stereotype.Service;

import com.email.Email.model.User;
import com.email.Email.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    UserRepository UserRepository;

    public List<User> findUserByExample(User user){
        Example<User> example = Example.of(user);
        return UserRepository.findAll(example);
    }

    public List<User> createUser(User user){
        List<User> temp = findUserByExample(user);
        if(temp.size() == 0){
            UserRepository.save(user);
            return findUserByExample(user);
        }
        temp.removeAll(temp);
        return temp;
    }
}
