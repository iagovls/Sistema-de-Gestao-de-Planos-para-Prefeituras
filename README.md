# 📘 Documento de Requisitos do Sistema: Monitoramento Planos CMDCA

---


![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)

## 🔹 Visão Geral

**Nome do Projeto:** Monitoramento Planos CMDCA  
**Objetivo:** Disponibilizar o acesso aos planos e propostas dos Conselhos Municipais dos Direitos da Criança e do Adolescente (CMDCA) por meio de uma interface amigável e funcional.

## 🧰 **Tecnologias Utilizadas**
Backend: Java com Spring Boot (incluindo Spring Security e JWT para autenticação)

Persistência: JPA com MySQL (hospedado no Amazon RDS)

Infraestrutura: Amazon EC2 (hospedagem da aplicação backend), Amazon RDS (banco de dados), AWS SES - Amazon Simple Email Service

Frontend: Next.js

---

## 🔸 Estrutura de Páginas do Sistema

### 1. Página Inicial

- **Título:** Monitoramento Planos CMDCA
- **Descrição:** Acesse aos planos e propostas do conselho municipal dos direitos da criança e do adolescente da sua prefeitura.
- **Componentes:**
  - Logotipos clicáveis das prefeituras
  - Cabeçalho:
    - **Não logado:** Link "Login"
    - **Logado:** DropDownMenu com: Conta | Sair
  - Rodapé:
    - Nome da empresa
    - Botão: Contato

---

### 2. Página de Contato

- **Título:** Contate-nos
- **Campos:**
  - Motivo: Elogio | Sugestão | Reclamação
  - Nome
  - E-mail
  - Mensagem
- **Funcionalidade:** Envio de e-mail com os dados preenchidos

---

### 3. Página de Login

- Campo: Usuário (e-mail)
- Campo: Senha
- Link: "Esqueci a senha"

---

### 4. Página de Conta

- Nome (botão: alterar)
- E-mail (botão: alterar)
- Senha (botão: alterar)
- Se usuário mestre:
  - Botão: "Visualizar todos os usuários"

---

### 5. Página: Todos os Usuários

- Lista de usuários com botão "Excluir usuário"
  - Pop-up de confirmação: "Você deseja realmente excluir `<nome do usuário>`?" (Botões: Sim | Não)
- Botão: "Cadastrar novo usuário"
  - Campo: E-mail
  - Funcionalidade: Envio de e-mail com link de cadastro

---

### 6. Página: Cadastro de Novo Usuário

- Título: "Olá `<e-mail>`, realize seu cadastro"
- Campos:
  - Nome completo
  - Senha
  - Confirmar senha

---

### 7. Página: Prefeitura

- Logomarcas da Prefeitura e do CMDCA
- Gráfico pizza com status geral das propostas (total, cumpridas, andamento, vencidas)
- Lista dos 5 Eixos com gráficos individuais:
  - Promoção de direitos
  - Proteção de direitos
  - Participação de crianças e adolescentes
  - Controle social
  - Gestão
- Botão: Baixar relatório geral em PDF

---

### 8. Página: Eixo

- Gráfico pizza com status das propostas do eixo
- Lista de categorias com gráficos individuais
- Botão: Baixar relatório do eixo em PDF

---

### 9. Página: Categoria

- Gráfico pizza com status das propostas da categoria
- Lista de planos com gráficos individuais
- Botão: Baixar relatório da categoria em PDF

---

### 10. Página: Plano

- Gráfico pizza com status das propostas do plano
- Lista de propostas:
  - Para usuários mestre ou não logado: mostrar **meta** e **status**
  - Para usuários com permissão de edição: mostrar **meta**, **status**, **botão: alterar proposta**
- Abaixo da lista de propostas ativas, exibir:
  - **Lista de Propostas Desativadas**
    - Ao lado de cada proposta desativada: **Botão: Restaurar**
    - **Restaurar Proposta (pop-up):**
      - Título da proposta
      - Campo obrigatório: Motivo
      - Botões: "Restaurar proposta" | "Cancelar"
- Botão: Baixar relatório do plano

---

### 11. Página: Alterar Proposta

- Campos editáveis:
  - Título (botão: alterar)
  - Data da meta (botão: alterar data)
  - Status (cumpridas | em andamento | vencidas)
- **Botão: Desativar proposta**
  - **Pop-up de desativação:**
    - Título da proposta
    - Campo obrigatório: Motivo
    - Botões: "Desativar proposta" | "Cancelar"
- **Histórico de alterações:**
  - Título
  - Data da meta
  - Status
  - Usuário que alterou
  - Data e hora da alteração
  - Motivo da alteração

---

## 🔸 Observações e Regras de Negócio

- Existência de **1 usuário mestre** por prefeitura e 1 por CMDCA
- Máximo de **2 administradores** por prefeitura
- Permissões diferenciadas:
  - Mestres: acesso a todos os dados e usuários
  - Editores: alterar status e metas das propostas
  - Leitores: apenas visualizar
- Propostas podem ser:
  - **Ativas**
  - **Desativadas** (com motivo obrigatório e opção de restauração)

---

### ⚙️ Funcionalidades Automatizadas

- **Todo dia 1º de janeiro:**
  - Todas as propostas com **meta "permanente"** terão seu status alterado automaticamente para “em andamento”
  - Envio de e-mail para todos os usuários solicitando avaliação

- **Todo dia 1 de cada mês:**
  - Envio de e-mail com:
    - Propostas com meta permanente
    - Propostas vencidas
    - Propostas com meta para vencer em:
      - Menos de 1 mês
      - Menos de 3 meses
      - Menos de 6 meses
      - Menos de 1 ano



