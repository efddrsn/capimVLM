# capimVLM

Protótipo de avaliação odontológica assistida por modelos de visão.

## Visão geral

O projeto oferece duas interfaces web construídas com Flask:

- **Painel principal (`/`)** – recebe o upload de uma foto, envia para o modelo de análise (simulado) e exibe:
  - JSON estruturado com os problemas odontológicos identificados;
  - Galeria "antes e depois" com a foto original e a versão corrigida pelo modelo de geração (simulado).
- **Back-end simplificado (`/backend`)** – painel para editar os prompts das duas chamadas de modelo, além de visualizar a resposta bruta do modelo de análise e a versão estruturada antes de ir para a UI principal.

Os serviços externos (OpenAI Vision e Gemini Nano-Banana) estão stubados para permitir o uso offline. As funções responsáveis estão isoladas em `app/services/vision.py` e `app/services/gemini.py`, facilitando a troca por integrações reais.

## Requisitos

- Python 3.11+
- Dependências listadas em `requirements.txt`

Instale-as com:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Como executar

```bash
export FLASK_APP=app.app
flask run --host 0.0.0.0 --port 5000
```

Acesse `http://localhost:5000` para o painel principal e `http://localhost:5000/backend` para editar os prompts.

## Estrutura de pastas

```
app/
├── app.py                # Rotas Flask e lógica principal
├── data/
│   ├── prompts.json      # Prompts editáveis persistidos em disco
│   └── state.json        # Últimos resultados processados
├── services/
│   ├── gemini.py         # Stub para geração de imagem (Gemini Nano-Banana)
│   └── vision.py         # Stub para análise de imagem (OpenAI Vision)
├── static/
│   ├── css/styles.css    # Estilos da interface
│   ├── enhanced/         # Saída gerada pelo modelo (salvo em runtime)
│   └── uploads/          # Imagens originais enviadas
└── templates/
    ├── backend.html      # Painel de edição de prompts e respostas
    ├── index.html        # Painel principal
    └── layout.html       # Layout base compartilhado
```

## Próximos passos sugeridos

1. Substituir os stubs pelas integrações reais com as APIs da OpenAI e do Gemini.
2. Adicionar autenticação simples ao painel de back-end.
3. Persistir os resultados em um banco de dados para histórico longitudinal dos pacientes.
