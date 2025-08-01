# Logos das Prefeituras

## Como adicionar logos de prefeituras ou de CMDCA

### 1. Adicionar a imagem no diretório public
Coloque a imagem da logo da prefeitura no diretório `public/` com o nome no formato:
```
prefeituraDe[NomeDaCidade]Logo.[extensão]
cmdca[NomeDaCidade]Logo.[extensão]
```

Exemplos:
- `prefeituraDeItabunaLogo.png`
- `prefeituraDeIlheusLogo.jpg`
- `prefeituraDeSalvadorLogo.png`

### 2. Atualizar o banco de dados
Execute a migração do banco de dados para adicionar o campo logo:
```bash
# No diretório www/
./mvnw flyway:migrate
```

### 3. Inserir/Atualizar a logo no banco
Use o endpoint da API para atualizar a logo de uma prefeitura:

```bash
curl -X PUT http://localhost:8080/prefeituras/{id}/logo-prefeitura \
  -H "Content-Type: application/json" \
  -d "/prefeituraDeItabunaLogo.png"
```

```bash
curl -X PUT http://localhost:8080/prefeituras/{id}/logo-cmdca \
  -H "Content-Type: application/json" \
  -d "/cmdcaDeItabunaLogo.png"
```

### 4. Estrutura atual das prefeituras

| ID | Nome | Logo |
|----|------|------|
| 1 | Presidente Tancredo Neves | /prefeituraDePresidenteTancredoNevesLogo.jpg |
| 2 | Itabuna | /prefeituraDeItabunaLogo.png |

### 5. Frontend
O frontend automaticamente carregará a logo específica de cada prefeitura. Se uma prefeitura não tiver logo definida, será usada a logo padrão de Presidente Tancredo Neves.

## Convenções de nomenclatura

- **Nome do arquivo**: `prefeituraDe[NomeDaCidade]Logo.[extensão]`
- **Caminho no banco**: `/prefeituraDe[NomeDaCidade]Logo.[extensão]`
- **Formato recomendado**: PNG ou JPG
- **Tamanho recomendado**: 100x100 pixels ou proporcional 