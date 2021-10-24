const ptBR = {
    // dictionary
    'yes': 'Sim',
    'no': 'Não',
    'none': 'Nenhuma',
    'document': 'Documento',
    'document_plural': 'Documentos',
    'category': 'Categoria',
    'category_plural': 'Categorias',
    'department': 'Departmento',
    'department_plural': 'Departmentos',
    'user': 'Usuário',
    'user_plural': 'Usuários',

    // utils
    'table.actions': 'Ações',

    // login
    'loginWithGoogle.buttonText': 'Entre com Google',

    // pageNotFound
    'pageNotFound.title': '404',
    'pageNotFound.subtitle': 'Oops! Parece que essa página não existe...',
    'pageNotFound.message': 'O link que você possui está errado ou esta página se refere a um conteúdo que foi movido ou excluído.',
    'pageNotFound.home': 'Clique aqui para voltar a página inicial',
    'pageNotFound.contactUs': 'Se você acredita que deveria haver algo aqui, entre em contato com os administradores do sistema.',

    // navbar
    'navbar.documents': '$t(document_plural)',
    'navbar.documents.add': 'Adicionar',
    'navbar.documents.search': 'Pesquisar',
    'navbar.management': 'Gerenciamento',
    'navbar.management.category': '$t(category_plural)',
    'navbar.management.department': '$t(department_plural)',
    'navbar.management.users': '$t(user_plural)',
    'navbar.language': 'Linguagem',
    'navbar.language.en-US.shortName': 'Inglês',
    'navbar.language.en-US.fullName': 'Inglês Americano',
    'navbar.language.pt-BR.shortName': 'Português',
    'navbar.language.pt-BR.fullName': 'Português Brasileiro',
    'navbar.department': '$t(department)',
    'navbar.logout': 'Sair',

    // document
    'document.title': 'Título',
    'document.status': 'Status',
    'document.summary': 'Resumo',
    'document.category': '$t(category)',
    'document.registeredBy': 'Cadastrado por',
    'document.date': 'Data do Documento',
    
    // document form
    'document.form.add.title': 'Novo Documento',
    'document.form.edit.title': 'Editar Documento',
    'document.form.summary.mutedText': 'Uma breve descrição do documento sendo enviado.',
    'document.form.category.choose': 'Escolha uma categoria...',
    'document.form.category.zeroOptions': 'Nenhuma categoria no departamento atual',
    'document.form.file': 'Arquivo',
    'document.form.file.choose': 'Escolha o arquivo',
    'document.form.file.placeholder': 'Nenhum arquivo selecionado',
    'document.form.deleteButton': 'Excluir',
    'document.form.updateButton': 'Atualizar',
    'document.form.submitButton': 'Enviar',
    'document.form.validation.fileRequired': 'Deve anexar um arquivo',
    'document.form.validation.invalidFileType': 'O tipo de arquivo enviado não é válido',
    'document.form.validation.titleRequired': 'Titulo é obrigatório',
    'document.form.validation.categoryRequired': 'Deve selecionar uma categoria',
    
    // document search
    'searchBar.filters.category': '$t(category)',
    'searchBar.filters.date.from': 'Data de',
    'searchBar.filters.date.until': 'até',
    'searchBar.searchButton': 'Pesquisar documentos',
    'searchBar.moreFiltersButton': 'Mais filtros',
    'searchBar.lessFiltersButton': 'Menos filtros',
    'searchBar.filters.registeredByMe': 'Apenas documentos cadastrados por mim',
    'search.noResultFound.message.p1': 'Nenhum resultado encontrado',
    'search.noResultFound.message.p2': ' para ',
    'search.noResultFound.message.p3': ' com os filtros especificados.',
    'search.noResultFound.searchTips.title': 'Sugestões:',
    'search.noResultFound.searchTips.item1': 'Certifique-se de que todas as palavras estão escritas corretamente.',
    'search.noResultFound.searchTips.item2': 'Tente usar outras/menos palavras-chave.',
    'search.noResultFound.searchTips.item3': 'Certifique-se de que todas os filtros opcionais estão preenchidos corretamente.',
    'search.noResultFound.searchTips.item4': 'Tente remover os filtros e readicioná-los gradualmente.',
    'search.error': 'Houve um erro realizando a busca desejada. Por favor, tente novamente mais tarde.',
    
    // user
    'user.name': 'Nome de usuário',
    'user.email': 'Email',

    // user table
    'user.table.title': 'Gerenciar Usuários',
    'user.table.headers.username': '$t(user.name)',
    'user.table.headers.email': '$t(user.email)',
    'user.table.headers.permission.1': 'Procurar documentos',
    'user.table.headers.permission.2': 'Adicionar documentos',
    'user.table.headers.permission.3': 'Editar documentos de outros usuários',
    'user.table.headers.permission.4': 'Excluir documentos de outros usuários',
    'user.table.headers.permission.5': 'Convidar usuários',
    'user.table.headers.permission.6': 'Gerenciar permissões de usuários',
    'user.table.headers.permission.7': 'Gerenciar categorias',
    'user.table.filters.text.username': 'Filtrar por nome de usuário',
    'user.table.filters.text.email': 'Filtrar por email',
    'user.table.filters.boolean.y': '$t(yes)',
    'user.table.filters.boolean.n': '$t(no)',

    // ?
    'user.invite': 'Convidar novo usuário',
}

export default ptBR;