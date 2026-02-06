package com.inmueblemanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaAuditing
@EnableJpaRepositories(basePackages = "com.inmueblemanager.repository")
public class InmuebleManagerBackApplication {

    public static void main(String[] args) {
        SpringApplication.run(InmuebleManagerBackApplication.class, args);
    }
}
