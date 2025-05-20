package com.email.Email.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.email.Email.model.Folder;
import com.email.Email.repository.FolderRepository;

import jakarta.transaction.Transactional;

@Service
public class FolderService {
    

    @Autowired
    FolderRepository FolderRepository;

    public List<Folder> findFolderByExample(String name, int uid){
        return FolderRepository.findByNameAndUid(name, uid);
    }

    @Transactional
    public boolean deleteFolderByExample(String name, int uid){
        if(FolderRepository.deleteByNameAndUid(name, uid) > 0){
            return true;
        }
        return false;
    }

    @Transactional
    public boolean deleteFolderTemplateByExample(int tid, String name){
        if(FolderRepository.deleteByTidAndName(tid, name) > 0){
            return true;
        }
        return false;
    }
}
