package com.example.event_manager.entities;

import jakarta.persistence.*;

import java.util.List;

public class Administrator {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // deixa pro banco cuidar disso
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @OneToMany(mappedBy = "administrator", cascade = CascadeType.ALL)
    private List<Event> events;
}
