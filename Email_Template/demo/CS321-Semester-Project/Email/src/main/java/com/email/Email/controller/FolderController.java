package com.email.Email.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.email.Email.model.Folder;
import com.email.Email.repository.FolderRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
public class FolderController {
    
    @Autowired
    FolderRepository FolderRepository;

    private final FolderService FolderService;

    public FolderController(FolderService FolderService){
        this.FolderService = FolderService;
    }

    @GetMapping("/get-all-folders")
    public List<Folder> getFolders(){
        return FolderRepository.findAll();
    }

    @PostMapping("/create-folder")
    public Folder createFolder(@RequestBody @Validated Folder folder) {
        FolderRepository.save(folder);
        return folder;
    }

    @GetMapping("/get-folder/{name}/{uid}")
    public List<Folder> getFolder(@PathVariable("name") String name, @PathVariable("uid") int uid){
        return FolderService.findFolderByExample(name, uid);
    }

    @PostMapping("/add-to-folder")
    public Folder addToFolder(@RequestBody @Validated Folder folder){
        FolderRepository.save(folder);
        return folder;
    }
    
    @DeleteMapping("/delete-folder/{name}/{uid}")
    public boolean deleteFolder(@PathVariable("name") String name, @PathVariable("uid") int uid){

        return FolderService.deleteFolderByExample(name, uid);
    }

    @DeleteMapping("/delete-folder-template/{tid}/{name}")
    public boolean deleteFolderTemplateByExample(@PathVariable("tid") int tid, @PathVariable("name") String name){
        return FolderService.deleteFolderTemplateByExample(tid, name);
    }

}
