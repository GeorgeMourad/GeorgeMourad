package com.email.Email.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Folder {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int fid;
    private String name;
    private int tid;
    private int uid;

    public Folder() {}

    public Folder(String name, int tid, int uid){
        this.name = name;
        this.tid = tid;
        this.uid = uid;
    }

    public String getName() {
        return name;
    }

    public int getTid() {
        return tid;
    }

    public int getUid() {
        return uid;
    }

    public void setName(String name) {
        this.name = name;
    }
}
