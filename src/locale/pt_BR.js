const ptBR = {
    // dictionary
    'yes': 'Sim',
    'no': 'Não',
    'none_male': 'Nenhum',
    'none_female': 'Nenhuma',
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
    'customButtons.add.tooltip': 'Adicionar',
    'customButtons.edit.tooltip': 'Editar',
    'customButtons.confirm.tooltip': 'Confirmar',
    'customButtons.cancel.tooltip': 'Cancelar',
    'customButtons.filter.tooltip': 'Filtrar',
    'customButtons.delete.tooltip': 'Excluir',
    'customButtons.clear.tooltip': 'Limpar',
    'customTable.addRow.text.placeholder': 'Entre com o texto',
    'customTable.addRow.validation.mandatoryField': 'Campo obrigatório',
    'customTable.filterRow.text.placeholder': 'Entre com o texto para filtrar',
    'customTable.filterRow.clearBtn.tooltip': 'Limpar todos os filtros',

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
    'navbar.department': '$t(department)',
    'navbar.department.category': '$t(category_plural)',
    'navbar.department.users': '$t(user_plural)',
    'navbar.system': 'Sistema',
    'navbar.system.department': '$t(department_plural)',
    'navbar.system.users': '$t(user_plural)',
    'navbar.language': 'Linguagem',
    'navbar.language.en-US.shortName': 'Inglês',
    'navbar.language.en-US.fullName': 'Inglês Americano',
    'navbar.language.pt-BR.shortName': 'Português',
    'navbar.language.pt-BR.fullName': 'Português Brasileiro',
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

    // user management
    'user.management.title': 'Gerenciar Usuários',
    'user.management.invite.title': 'Convidar Usuário',
    'user.management.department-permissions.title': 'Gerenciar Permissões de Departamento',
    'user.management.system-permissions.title': 'Gerenciar Permissões de Sistema',
    
    // user invite
    'user.management.invite.placeholder': 'Entre com o email do usuário',
    'user.management.invite.validation.invalidEmailFormat': 'Email com formato inválido',
    'user.management.invite.validation.invalidDomain': 'Email deve pertencer às organizações @uniriotec.br ou @edu.unirio.br',
    'user.management.invite.button': 'Enviar convite',

    // user table
    'user.table.headers.status': 'Status',
    'user.table.headers.username': '$t(user.name)',
    'user.table.headers.email': '$t(user.email)',
    'user.table.headers.permission.search_docs': 'Procurar documentos',
    'user.table.headers.permission.add_docs': 'Adicionar documentos',
    'user.table.headers.permission.edit_docs_others': 'Editar documentos de outros usuários',
    'user.table.headers.permission.delete_docs_others': 'Excluir documentos de outros usuários',
    'user.table.headers.permission.invite_users': 'Convidar usuários',
    'user.table.headers.permission.manage_categories': 'Gerenciar categorias',
    'user.table.headers.permission.manage_dept_perm': 'Gerenciar permissões de departamento',
    'user.table.headers.permission.manage_system_perm': 'Gerenciar permissões de sistema',
    'user.table.headers.permission.manage_departments': 'Gerenciar departamentos',
    'user.table.filters.text.username': 'Filtrar por nome de usuário',
    'user.table.filters.text.email': 'Filtrar por email',
    'user.table.filters.boolean.y': '$t(yes)',
    'user.table.filters.boolean.n': '$t(no)',
    'user.table.filters.status.y': 'Ativo',
    'user.table.filters.status.n': 'Pendente',
    'user.table.headers.buttons.invite': 'Convidar usuário',
    'user.table.headers.buttons.filter': 'Filtrar usuários',
    'user.table.headers.buttons.permissions.batch_edit': 'Editar permissões dos usuários',
    'user.table.headers.buttons.permissions.batch_edit.confirm': 'Confirmar',
    'user.table.headers.buttons.permissions.batch_edit.cancel': 'Cancelar',
    'user.table.filters.buttons.clear': 'Limpar todos os filtros',
    'user.table.data.status.y': 'Ativo',
    'user.table.data.status.n': 'Pendente',
    'user.table.data.buttons.permissions.edit': 'Editar permissões do usuário',
    'user.table.data.buttons.permissions.edit.confirm': 'Confirmar',
    'user.table.data.buttons.permissions.edit.cancel': 'Cancelar',
    'user.table.data.buttons.user.delete': 'Remover usuário deste departamento',

    //system management
    //departments page
    'departments.page.header': 'Departmentos',

    //departments table
    'departments.table.headers.acronym': 'Sigla',
    'departments.table.headers.name': 'Nome',
    'departments.table.data.isCurrentDept.y': 'Departmento atual',
    'departments.customTable.addRow.acronym.placeholder': 'Entre a sigla do departamento',
    'departments.customTable.addRow.name.placeholder': 'Entre o nome do departamento',
    'departments.customTable.addRow.addBtn.tooltip': 'Adicionar novo departamento',
    'departments.customTable.addRow.validation.acronymMaxLength': 'Sigla deve ter no máximo 5 caracteres',
    'departments.customTable.addRow.validation.cantContainWhitespaces': 'Sigla não pode conter espaços em branco',
}

export default ptBR;