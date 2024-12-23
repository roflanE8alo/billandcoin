package org.example.userregistrationapp.controller;

import org.example.userregistrationapp.model.SupportTicket;
import org.example.userregistrationapp.model.User;
import org.example.userregistrationapp.repository.SupportTicketRepository;
import org.example.userregistrationapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/support/tickets")
public class SupportTicketController {

    @Autowired
    private SupportTicketRepository ticketRepository;

    @Autowired
    private UserRepository userRepository;

    // Создание нового тикета
    @PostMapping
    public SupportTicket createTicket(@RequestBody SupportTicket ticket) {
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    // Получение всех тикетов пользователя
    @GetMapping("/user/{userId}")
    public List<SupportTicket> getUserTickets(@PathVariable Long userId) {
        return ticketRepository.findByUserId(userId);
    }

    // Ответ на тикет
    @PutMapping("/{ticketId}/respond")
    public SupportTicket respondToTicket(@PathVariable Long ticketId, @RequestBody SupportTicket updatedTicket) {
        Optional<SupportTicket> optionalTicket = ticketRepository.findById(ticketId);
        if (optionalTicket.isPresent()) {
            SupportTicket ticket = optionalTicket.get();
            ticket.setResponse(updatedTicket.getResponse());
            ticket.setRespondedBy(updatedTicket.getRespondedBy());
            ticket.setUpdatedAt(LocalDateTime.now());
            return ticketRepository.save(ticket);
        } else {
            throw new RuntimeException("Ticket not found");
        }
    }
}