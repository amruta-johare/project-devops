package com.project.pgmanagement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.project.pgmanagement.entity.PG;
import com.project.pgmanagement.entity.Role;
import com.project.pgmanagement.entity.User;
import com.project.pgmanagement.repository.PGRepository;
import com.project.pgmanagement.repository.UserRepository;

@SpringBootApplication
public class PgmanagementApplication /*implements CommandLineRunner*/{

	public static void main(String[] args) {
		SpringApplication.run(PgmanagementApplication.class, args);
	}
	
	private  final UserRepository userRepo;
    private  final PGRepository pgRepo;
    
    public PgmanagementApplication(UserRepository userRepo, PGRepository pgRepo) {
        this.userRepo = userRepo;
        this.pgRepo = pgRepo;
    }
    
//	@Override
//	public void run(String... args) throws Exception {
//		// TODO Auto-generated method stub
//	
//		User owner = new User();
//        owner.setName("Owner1");
//        owner.setEmail("owner@test.com");
//        owner.setPassword("123");
//        owner.setRole(Role.OWNER);
//
//        userRepo.save(owner);
//
//        PG pg = new PG();
//        pg.setName("Test PG");
//        pg.setLocation("Mumbai");
//        pg.setRent(5000);
//        pg.setBhkType("2BHK");
//        pg.setTotalRooms(10);
//        pg.setAvailableRooms(5);
//        pg.setOwner(owner);
//
//        pgRepo.save(pg);
//
//        System.out.println("TEST DATA INSERTED");
//	}

}
