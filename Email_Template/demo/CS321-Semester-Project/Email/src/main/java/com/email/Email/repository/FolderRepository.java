package com.email.Email.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.email.Email.model.Folder;

public interface FolderRepository extends JpaRepository<Folder, Integer>{
    
    List<Folder> findByNameAndUid(String name, int uid);

    long deleteByNameAndUid(String name, int uid);

    long deleteByTidAndName(int tid, String name);
}
