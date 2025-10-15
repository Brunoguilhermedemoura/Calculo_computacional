# Calculadora de Limites - React

Uma calculadora de limites matemáticos desenvolvida em React, migrada do sistema Python original. Permite calcular limites de funções com passos detalhados, visualização gráfica e suporte à notação matemática brasileira.

## 🚀 Funcionalidades

- **Cálculo de Limites**: Suporte a todas as formas indeterminadas (0/0, ∞/∞, etc.)
- **Notação Brasileira**: Aceita sen, tg, ln, vírgula decimal (convertida automaticamente)
- **Passos Detalhados**: Mostra cada etapa do cálculo
- **Dicas Técnicas**: Sugestões baseadas no tipo de limite
- **Gráficos Interativos**: Visualização da função na vizinhança do ponto limite
- **Exemplos Prontos**: Biblioteca de exemplos para prática
- **Ajuda de Sintaxe**: Guia completo de como digitar expressões

## 🛠️ Tecnologias Utilizadas

- **React 18** - Framework principal
- **Material-UI** - Componentes de interface
- **Math.js** - Cálculos matemáticos
- **Plotly.js** - Gráficos interativos
- **KaTeX** - Renderização de fórmulas matemáticas
- **Vite** - Build tool

## 📦 Instalação

1. Clone o repositório:

```bash
git clone <url-do-repositorio>
cd calculadora-limites-react
```

2. Instale as dependências:

```bash
npm install
```

3. Execute a aplicação:

```bash
npm run dev
```

4. Acesse no navegador: `http://localhost:5173`

## 🎯 Como Usar

### Entrada de Dados

- **Função**: Digite a expressão matemática (ex: `sin(x)/x`, `(x^2-1)/(x-1)`)
- **Ponto Limite**: Digite o valor para onde x tende (ex: `0`, `oo`, `-oo`)
- **Direção**: Escolha entre "Ambos", "Esquerda" ou "Direita"

### Exemplos de Entrada

```
sin(x)/x quando x → 0
(x^2-1)/(x-1) quando x → 1
(sqrt(x+1)-1)/x quando x → 0
(1+1/x)^x quando x → oo
```

### Notação Suportada

- **Operadores**: `+`, `-`, `*`, `/`, `^` ou `**` (potência)
- **Funções**: `sin`, `cos`, `tan`, `log`, `sqrt`, `exp`, `abs`
- **Constantes**: `pi`, `E` (euler), `oo` (infinito)
- **Notação BR**: `sen` → `sin`, `tg` → `tan`, `ln` → `log`

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── Calculator.jsx   # Componente principal
│   ├── InputSection.jsx # Seção de entrada
│   ├── ResultSection.jsx # Seção de resultados
│   ├── ExamplesModal.jsx # Modal de exemplos
│   ├── HelpModal.jsx    # Modal de ajuda
│   └── GraphModal.jsx   # Modal de gráficos
├── services/            # Lógica de negócio
│   ├── limitsEngine.js  # Motor de cálculo
│   ├── mathParser.js    # Parser matemático
│   └── graphService.js  # Serviço de gráficos
├── hooks/               # Hooks personalizados
│   └── useLimits.js     # Hook da calculadora
├── utils/               # Utilitários
│   └── constants.js     # Constantes e configurações
└── App.jsx              # Aplicação principal
```

## 🔧 Desenvolvimento

### Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza build de produção
- `npm run lint` - Executa linter

### Adicionando Novas Funcionalidades

1. **Novos Tipos de Limite**: Edite `limitsEngine.js`
2. **Novos Componentes**: Crie em `components/`
3. **Novos Serviços**: Adicione em `services/`
4. **Novos Exemplos**: Atualize `constants.js`

## 🐛 Resolução de Problemas

### Erro de Cálculo

- Verifique a sintaxe da expressão
- Use parênteses para agrupar operações
- Confirme se o ponto limite é válido

### Gráfico Não Aparece

- Verifique se a função é válida
- Confirme se o ponto limite é finito
- Tente regenerar o gráfico

### Problemas de Performance

- Use `npm run build` para versão otimizada
- Verifique se todas as dependências estão atualizadas

## 📚 Migração do Python

Este projeto é uma migração completa do sistema Python original:

### Funcionalidades Migradas

- ✅ Interface gráfica (Tkinter → Material-UI)
- ✅ Motor de cálculo (SymPy → Math.js)
- ✅ Sistema de exemplos
- ✅ Ajuda de sintaxe
- ✅ Plotagem de gráficos (Matplotlib → Plotly)
- ✅ Notação brasileira
- ✅ Detecção de formas indeterminadas

### Melhorias Adicionadas

- 🆕 Interface responsiva
- 🆕 Gráficos interativos
- 🆕 Melhor UX/UI
- 🆕 Código modular
- 🆕 TypeScript ready
- 🆕 PWA ready

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Autores

- **Migração**: Desenvolvido como migração do sistema Python original
- **Tecnologias**: React + Material-UI + Math.js

## 🙏 Agradecimentos

- Sistema Python original que serviu de base
- Comunidade React e Material-UI
- Bibliotecas Math.js e Plotly.js
- Equipe de desenvolvimento
