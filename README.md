# data-challenge

# Finalidade
Este documento fornece uma visão arquitetural abrangente do desafio “data-challenge”, usando diversas visões de arquitetura para representar diferentes características do sistema. Assim como define e registra as decisões arquiteturais significativas tomadas em relação ao sistema.

# Escopo
Este documento abrange assuntos relacionados às metas e restrições da arquitetura, uma visão lógica, descreve a estrutura geral do modelo de implementação, fornece uma perspectiva do modelo de classes do sistema, arquitetura da solução e por fim descreve características de desempenho e qualidade.

# Visão Geral
O desafio consiste em pesquisar e extrair dados úteis para investigações realizadas pelo Ministério Público de São Paulo. Os dados serão extraídos de diversos sites por meio de técnicas de scraping, reunidos em uma base de dados e condensados em um relatório final que poderá auxiliar a instituição a investigar denúncias nas diferentes áreas de atuação.
Portais a serem explorados:

1. Facebook: Coletar informações do perfil, telefone, e-mail, foto, endereço, pessoas da família e locais que costuma frequentar.
2. Linkedin: Perfil, último trabalho e formação acadêmica.
3. Escavador e JusBrasil: Coletar processo judiciais, se possível separar como acusador, acusado ou apenas citado no processo.
4. Google Maps: Utilizando informações de endereço de check-in no facebook ou endereços das empresas do Linkedin, capturar a imagem do Google Street View.
5. Consulta Sócio: Extrair dados de sócios do buscado.
6. Busca Google: Extrair os resultados da primeira página da busca.
7. SIVEC: Consultar pessoas por RG.
8. JUCESP: Consulta de empresas por nome ou CNPJ
