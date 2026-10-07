---
format: 1920x1080
duration: 230s
message: "Do cadastro da empresa à consulta da sua equipe: tudo no Painel Empresarial Viva Mais"
arc: Abertura → cadastro e plano → painel → vidas → planilha → primeiro acesso → grupos → créditos → fatura → agendamento → consulta → relatório → fecho
audience: RH e gestores de empresas no plano empresarial Viva Mais
mode: autonomous
---

## Frame 1 — Abertura

- scene: Sala de espera de uma clínica Viva Mais (imagem gerada) com a marca real no painel da parede, no balcão e na TV; o notebook do balcão mostra a tela real de cadastro
- duration: 6.4s
- poster: 3s
- transition_in: cut
- status: animated
- src: compositions/ch00-intro.html
- motion: push-in contínuo (Ken Burns) sobre a imagem; rules waterfall-entry (título), coordinate-target-zoom (notebook), zoom-through para a UI real
- start: 0s

Plano aberto da recepção: paredes claras, poltronas e balcão violeta, detalhes lima. O painel da parede acende com a marca Viva Mais, a marca aparece no balcão e na TV, e o notebook do balcão liga mostrando a tela real de cadastro. Título “Do cadastro à consulta da sua equipe.” sobe no canto inferior esquerdo. A câmera empurra devagar e depois acelera para dentro do notebook, saindo em zoom-through para a interface real.

## Frame 2 — Cadastre sua empresa

- scene: Notebook: formulário Dados da Empresa digitado campo a campo, planos com 10 vidas, PIX com QR Code, chegada ao painel
- duration: 39s
- poster: 12s
- transition_in: zoom-through
- status: animated
- src: compositions/ch01-cadastro.html
- motion: cursor-ui-demo (Key_Feature); rules coordinate-target-zoom, multi-phase-camera, cursor-click-ripple, press-release-spring, discrete-text-sequence (digitação), counting-dynamic-scale (vidas e total), spring-pop-entrance (modal, QR), waterfall-entry (coluna de texto)
- start: 6.4s

Continua o mergulho da abertura: a tela do notebook da recepção vira o notebook com /empresa-cadastro e a câmera segue direto até o formulário, sem título no meio; o cursor clica e digita Aurora Logística, CNPJ 12.345.678/0001-90, e-mail, telefone e senha. Clique em Próxima Etapa troca para a página de planos (stepper Cadastro ✓ · Planos · Pagamento). No Viva+ Completo o “+” sobe até 10 vidas e o total chega a R$ 499,00. Ir para pagamento abre Finalizar Assinatura; PIX, Gerar QR Code PIX, QR aparece. Pagamento confirmado leva ao Dashboard com os toasts reais.

## Frame 3 — Conheça o painel

- scene: Dashboard recém-criado: cards de resumo, passeio pelo menu lateral e clique em Vidas
- duration: 13.3s
- poster: 7s
- transition_in: cut-the-curve LEFT
- status: animated
- src: compositions/ch02-painel.html
- motion: cursor-ui-demo (Product_Intro, hover-inspect); rules coordinate-target-zoom, multi-phase-camera, css-marker-patterns (contorno nos itens), cursor-click-ripple
- start: 45.4s

Plano aberto com a coluna “02 · Conheça o painel”. A câmera entra no Dashboard “Bem-vindo, Aurora!”, destaca a fileira Total de Vidas · Vidas Ativas · Créditos Utilizados · Planos Ativos, depois fecha no menu lateral e o cursor percorre Vidas, Grupos de Assinatura, Créditos e Financeiro, cada item recebendo o contorno violeta. Termina com o clique em Vidas.

## Frame 4 — Cadastre as vidas

- scene: Gerenciar Vidas vazio, diálogo Cadastrar Novo Funcionário digitado, primeira vida na lista com convite pendente
- duration: 19.8s
- poster: 12s
- transition_in: cut-the-curve UP
- status: animated
- src: compositions/ch03-vidas.html
- motion: cursor-ui-demo (Key_Feature, static-stage tour + chase); rules spring-pop-entrance (diálogo), discrete-text-sequence (digitação), dynamic-content-sequencing (select de gênero), waterfall-entry (linha da tabela), cursor-click-ripple, press-release-spring
- start: 58.7s

Coluna “03 · Cadastre as vidas” e o notebook em Gerenciar Vidas (Nenhuma vida cadastrada). Clique em Cadastrar Novo abre o diálogo; o cursor digita Marina Azevedo, 382.190.457-16, e-mail, 14/03/1991, telefone e Analista de RH, abre Gênero e escolhe Feminino. Cadastrar fecha o diálogo, a linha da Marina entra na tabela com o selo “Aguardando ativação” e o toast “Funcionário cadastrado. O convite de primeiro acesso foi agendado.”

## Frame 5 — Importe a planilha

- scene: Diálogo Importar Vidas: colunas obrigatórias, arquivo vidas-aurora.csv, sucesso e tabela com 9 vidas
- duration: 16.6s
- poster: 12s
- transition_in: zoom-through
- status: animated
- src: compositions/ch04-planilha.html
- motion: cursor-ui-demo (Key_Feature, drag-drop journey); rules spring-pop-entrance (diálogo, aviso de sucesso), cursor-drag (arquivo até a área pontilhada), waterfall-entry (8 linhas em cascata), css-marker-patterns
- start: 78.5s

Coluna “04 · Importe a planilha”. No notebook, a lista tem só a Marina. Clique em Importar Planilha de Vidas abre o diálogo; o contorno destaca o quadro azul das colunas obrigatórias. O arquivo vidas-aurora.csv voa até a área pontilhada, o nome aparece, clique em Importar mostra “8 funcionário(s) importado(s)”. O diálogo fecha e oito linhas entram em cascata na tabela, total de 9 funcionário(s).

## Frame 6 — A vida ativa a conta

- scene: Tablet: tela Crie sua senha de acesso preenchida e confirmação de primeiro acesso concluído
- duration: 12.4s
- poster: 9s
- transition_in: cut-the-curve LEFT
- status: animated
- src: compositions/ch05-acesso.html
- motion: device-surface-showcase + cursor-ui-demo; rules coordinate-target-zoom, discrete-text-sequence (senha), spring-pop-entrance (cartão de sucesso), cursor-click-ripple
- start: 95.1s

Troca de aparelho: coluna “05 · A vida ativa a conta” e um tablet com /primeiro-acesso. A câmera entra no cartão “Crie sua senha de acesso”; o cursor digita a senha nos dois campos e clica em Criar senha. O cartão troca para “Primeiro acesso concluído!” com os dados de acesso da Marina e o toast “Sua senha foi criada com sucesso!”.

## Frame 7 — Organize em grupos

- scene: Grupos de Assinatura: novo grupo Viva+ Premium com 3 vagas, depois 9 vidas adicionadas ao Viva+ Completo
- duration: 19.1s
- poster: 14s
- transition_in: zoom-through
- status: animated
- src: compositions/ch06-grupos.html
- motion: cursor-ui-demo (Key_Feature, static-stage tour); rules spring-pop-entrance (diálogos, dropdown), dynamic-content-sequencing (select de plano, checkboxes), waterfall-entry (linha nova), css-marker-patterns, cursor-click-ripple
- start: 107.5s

Coluna “06 · Organize em grupos”. A página Gerenciar Grupos de Assinatura mostra Viva+ Completo 0 / 10. Novo Grupo abre o diálogo; o cursor escolhe Viva+ Premium, digita 3 e cria o grupo (nova linha + toast). Em seguida Gerenciar Vidas do Completo abre a lista de funcionários disponíveis, o cursor marca “Selecionar até 10” e clica em Adicionar Selecionados. De volta à tabela, o contorno destaca 9 / 10.

## Frame 8 — Defina os créditos

- scene: Créditos: dia 10 e R$ 1.500 por ciclo, saldo aparece, vidas autorizadas em lote e limite pessoal de R$ 200 para uma vida
- duration: 24.4s
- poster: 16s
- transition_in: cut-the-curve UP
- status: animated
- src: compositions/ch07-creditos.html
- motion: cursor-ui-demo (Key_Feature, chase); rules discrete-text-sequence (campos), counting-dynamic-scale (saldo), nudge-curve (scroll da página), spring-pop-entrance (painel de seleção), waterfall-entry (linhas autorizadas), css-marker-patterns
- start: 126.6s

Coluna “07 · Defina os créditos”. Na página Créditos o cursor digita 10 em Dia da fatura e 1500 em Valor de créditos por ciclo e salva: surge o aviso verde “Gestão de créditos atualizada”, o Saldo disponível sobe até R$ 1.500,00 e o próximo faturamento aparece. A página rola até Autorizações de uso; Adicionar vidas abre a lista, Selecionar todas, Adicionar selecionadas e as linhas entram em cascata como Autorizada. No lápis do Rafael Monteiro o limite pessoal vira R$ 200,00.

## Frame 9 — Pague a fatura

- scene: Financeiro: cards de Planos & Créditos, fatura de R$ 1.500,00 pendente com QR Code PIX, código copiado e status Pago
- duration: 21.6s
- poster: 11s
- transition_in: cut-the-curve LEFT
- status: animated
- src: compositions/ch08-financeiro.html
- motion: cursor-ui-demo (Key_Feature, chase); rules nudge-curve (scroll), coordinate-target-zoom (fatura, QR), css-marker-patterns, dynamic-content-sequencing (Pendente → Pago), cursor-click-ripple, press-release-spring
- start: 151s

Coluna “08 · Pague a fatura”. A página Financeiro abre em Planos & Créditos (R$ 499,00/mês, créditos disponíveis e utilizados). A página rola até Faturamento de Créditos: fatura de R$ 1.500,00 com selo Pendente e o bloco PIX com QR Code e código copia e cola. O cursor clica em Copiar código PIX (vira “Código copiado”). Depois do pagamento a fatura aparece com o selo Pago e Total Pago atualizado.

## Frame 10 — Agende para uma vida

- scene: Agendar consulta para uma vida: Marina Azevedo, Cardiologia, Dra. Mariana Costa às 16:00, confirmação e histórico
- duration: 19.2s
- poster: 13s
- transition_in: zoom-through
- status: animated
- src: compositions/ch09-agendar.html
- motion: cursor-ui-demo (Key_Feature, chase); rules control-target-sync (seleções → Resumo), spring-pop-entrance (dropdown, histórico), waterfall-entry (médicos e horários), nudge-curve (scroll), cursor-click-ripple, press-release-spring
- start: 172.6s

Coluna “09 · Agende para uma vida”. Na página Agendar consulta para uma vida o cursor seleciona o cartão da Marina Azevedo e o Resumo à direita passa a mostrar o nome. A página rola até Médico e horário: Especialidade → Cardiologia, os médicos entram em cascata com foto, clique na Dra. Mariana Costa e nos horários escolhe 16:00. O Resumo mostra R$ 189,90 na próxima fatura. Confirmar agendamento dispara o toast e o Histórico de consultas abre com a consulta Agendada.

## Frame 11 — A vida entra na consulta

- scene: Tablet da Marina: Sua consulta de Cardiologia com Dra. Mariana Costa, resumo com pagamento confirmado e acesso à sala
- duration: 15s
- poster: 8s
- transition_in: cut-the-curve UP
- status: animated
- src: compositions/ch10-consulta.html
- motion: device-surface-showcase; rules coordinate-target-zoom, multi-phase-camera, css-marker-patterns, waterfall-entry (cartões)
- start: 191.8s

Coluna “10 · A vida entra na consulta” e o tablet com a página Sua consulta. A câmera entra no cabeçalho (Cardiologia · Médico: Mariana Costa · Agendada), passa pelos participantes com a foto da médica, destaca no Resumo o pagamento Confirmado e termina no botão de acesso no horário agendado.

## Frame 12 — Acompanhe o uso

- scene: Relatório de uso com seis consultas e volta ao Dashboard com os números atualizados
- duration: 17s
- poster: 9s
- transition_in: cut-the-curve LEFT
- status: animated
- src: compositions/ch11-relatorio.html
- motion: dataviz-countup + cursor-ui-demo; rules counting-dynamic-scale (totais), waterfall-entry (linhas), coordinate-target-zoom, css-marker-patterns, cursor-click-ripple
- start: 206.8s

Coluna “11 · Acompanhe o uso”. No Relatório de uso os totais contam até 6 registros e R$ 839,50; as seis linhas de Consumo geral por colaborador entram em cascata (Marina Azevedo · Cardiologia · R$ 189,90 em destaque). O cursor clica em Dashboard e o painel mostra 9 vidas, 7 ativas, R$ 839,50 em créditos utilizados e 2 planos vigentes.

## Frame 13 — Fecho

- scene: Cartão final: sua equipe já pode se cuidar, com o caminho completo resumido
- duration: 5.8s
- poster: 4s
- transition_in: inverse zoom-through
- status: animated
- src: compositions/ch12-outro.html
- motion: titlecard-reveal; rules waterfall-entry (título), stat-bars-and-fills (linha do caminho), center-outward-expansion (marcos)
- start: 223.8s

Chegada em inverse zoom-through. Logo, título “Pronto. Sua equipe já pode se cuidar.” e uma linha do caminho com cinco marcos (Empresa, Vidas, Créditos, Fatura, Consulta) que se preenche da esquerda para a direita. Endereço vivamais.ai/empresas no rodapé.
