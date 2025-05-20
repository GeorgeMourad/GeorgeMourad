package com.email.Email.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;

@Entity
public class Template {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int tid;
    private String subject;
    private String introduction;
    private String action;
    private String closing;
    private String signature;
    public boolean publicly;

    @JoinColumn(name = "uid")
    private int uid;

    public Template() {}

    public Template(String subject, String introduction, String action, String closing, String signature, boolean publicly, int uid){
        this.subject = subject;
        this.introduction = introduction;
        this.action = action;
        this.closing = closing;
        this.signature = signature;
        this.publicly = publicly;
        this.uid = uid;
    }

    public int getTID(){
        return tid;
    }

    public int getUID() {
        return uid;
    }

    public String getSubject() {
        return subject;
    }

    public String getIntroduction() {
        return introduction;
    }

    public String getAction() {
        return action;
    }

    public String getClosing() {
        return closing;
    }

    public String getSignature() {
        return signature;
    }

    public boolean getPublicly(){
        return publicly;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public void setIntroduction(String introduction) {
        this.introduction = introduction;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public void setClosing(String closing) {
        this.closing = closing;
    }

    public void setSignature(String signature) {
        this.signature = signature;
    }

    public void setPublicly(boolean publicly) {
        this.publicly = publicly;
    }
}
