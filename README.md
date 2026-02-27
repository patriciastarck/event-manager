# EventManager - Sistema de Gerenciamento de Eventos

[cite_start]O **EventManager** é uma solução Fullstack completa para o gerenciamento de eventos, desenvolvida como parte do Desafio de Residência[cite: 1]. [cite_start]O sistema permite que administradores gerenciem o ciclo de vida completo de eventos (CRUD) de forma segura, utilizando interfaces Web e Mobile conectadas a uma API REST centralizada[cite: 2, 21].

---

## ?? Arquitetura do Sistema

O projeto utiliza uma arquitetura baseada em **monorepo**, composta por três pilares principais:

1.  [cite_start]**Backend (Spring Boot):** API RESTful que gerencia regras de negócio, persistência de dados no PostgreSQL e segurança via JWT[cite: 21, 39, 480].
2.  [cite_start]**Frontend Web (React):** Single Page Application focada no painel administrativo[cite: 2, 11].
3.  [cite_start]**Mobile (React Native/Expo):** Aplicação nativa para gerenciamento e visualização de eventos em dispositivos móveis[cite: 2].



---

## ?? Tecnologias Utilizadas

### **Backend**
* [cite_start]**Java & Spring Boot 3**: Framework base para construção da API[cite: 21, 472].
* [cite_start]**Spring Security & JWT**: Autenticação stateless para proteção de rotas[cite: 39, 47].
* [cite_start]**PostgreSQL**: Banco de dados relacional.
* [cite_start]**Spring Data JPA**: Abstração de persistência e mapeamento objeto-relacional[cite: 255, 484].
* [cite_start]**Swagger (OpenAPI 3)**: Documentação interativa dos endpoints[cite: 40, 86].

### **Frontend & Mobile**
* [cite_start]**React (Vite)**: Biblioteca para a interface Web[cite: 2, 511].
* [cite_start]**React Native com Expo**: Framework para a aplicação mobile nativa[cite: 2].
* [cite_start]**CSS Moderno**: Estilização com variáveis e animações personalizadas[cite: 899, 942].

---

## ?? Estrutura de Pastas

```text
/
??? backend/                 # API Java Spring Boot
?   ??? src/main/java/com/example/event_manager/
?   ?   ??? configs/         # Configurações (Security, Swagger)
?   ?   ??? controllers/     # Endpoints REST
?   ?   ??? domain/dtos/     # Records para transferência de dados
?   ?   ??? entities/        # Entidades JPA (Administrator, Event)
?   ?   ??? security/        # Filtros de autenticação e TokenService
?   ?   ??? services/        # Regras de negócio
??? frontend-web/            # Aplicação React (Vite)
??? mobile/                  # Aplicação React Native (Expo)
## ?? Como Executar o Projeto

### 1. Backend
* [cite_start]Certifique-se de ter o **PostgreSQL** instalado e um banco chamado `event_db` criado[cite: 480].
* [cite_start]Configure as credenciais do banco no arquivo `application.properties`[cite: 478, 482].
* Execute o comando:
```bash
./mvnw spring-boot:run
### 2. Frontend Web
* [cite_start]Navegue até a pasta do frontend. 
* Instale as dependências:
```bash
npm install
* Inicie o servidor:
```bash
npx expo start
## ?? Endpoints Principais

[cite_start]A API utiliza Segurança **JWT** para todos os serviços, exceto o login[cite: 39, 63, 65].

| Método | Endpoint | Descrição | Segurança |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | [cite_start]Cadastro de administrador [cite: 114, 118] | [cite_start]Público [cite: 63] |
| `POST` | `/api/auth/login` | [cite_start]Login e geração de Token [cite: 114, 123] | [cite_start]Público [cite: 63] |
| `GET` | `/api/events` | [cite_start]Lista eventos do administrador logado [cite: 139, 147] | [cite_start]JWT [cite: 65] |
| `POST` | `/api/events` | [cite_start]Cria um novo evento [cite: 139, 143] | [cite_start]JWT [cite: 65] |
| `PUT` | `/api/events/{id}` | [cite_start]Atualiza data e localização de um evento [cite: 139, 156] | [cite_start]JWT [cite: 65] |
| `DELETE` | `/api/events/{id}` | [cite_start]Exclui um evento da lista [cite: 139, 151] | [cite_start]JWT [cite: 65] |

---

## ?? Autor e Status

* [cite_start]**Status**: Projeto de Portfólio / Desafio Técnico[cite: 1, 41].
* **Autor**: [Seu Nome]

