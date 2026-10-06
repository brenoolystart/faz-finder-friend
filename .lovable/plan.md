# Conteúdo e fotos editáveis no painel

## Objetivo
Transformar o painel `/admin` no ponto único para alterar tudo que aparece na página pública: títulos, descrições, textos curtos, contato, rodapé e imagens.

## O que será feito
- Criar uma área **Conteúdo do site** no painel, organizada por blocos: topo, apresentação, destaques, catálogo, demonstração, carrinho e rodapé.
- Permitir editar e salvar todos os textos visíveis, mantendo os textos atuais como conteúdo inicial.
- Criar uma área **Fotos do site** com prévia, envio pelo celular/computador e troca da imagem principal e das quatro imagens do carrossel.
- Manter a gestão atual de categorias, subcategorias, itens, preços e ícones.
- Fazer a página pública carregar textos e fotos atualizados pelo painel sem alterar o visual hacker atual.
- Mostrar mensagens claras de sucesso e erro e validar tipo/tamanho das imagens.

## Persistência e segurança
- Adicionar tabelas públicas somente para leitura do conteúdo publicado; alterações continuam protegidas pela senha do painel e acontecem no servidor.
- Criar armazenamento público exclusivo para imagens do site, com gravação restrita ao servidor administrativo.
- Preservar as imagens e textos atuais como fallback para evitar página vazia durante a transição.

## Verificação
- Testar login do painel, edição de texto, envio/troca de imagem e atualização da página pública.
- Conferir o resultado em largura de celular e desktop, incluindo carrossel e carrinho.
- Confirmar compilação sem erros e metadados próprios nas páginas pública e administrativa.
