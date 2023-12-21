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
    'department': 'Departamento',
    'department_plural': 'Departamentos',
    'user': 'Usuário',
    'user_plural': 'Usuários',
    'delete': 'excluir',
    'warning': 'Atenção',

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
    'customTable.filterRow.boolean.y': '$t(yes)',
    'customTable.filterRow.boolean.n': '$t(no)',
    'customTable.filterRow.clearBtn.tooltip': 'Limpar todos os filtros',
    'select.loading': 'Carregando...',

    // status
    'status.pending': 'Pendente',
    'status.processing': 'Processando',
    'status.processed': 'Processado',
    'status.failed_import': 'Falha na importação',
    'status.failed_processing': 'Falha no processamento',
    'status.empty_content': 'Sem Conteúdo',

    // notifications
    'notifications.header.default.success': 'Sucesso',
    'notifications.header.default.warning': '$t(warning)',
    'notifications.header.default.error': 'Erro',
    'notifications.header.default.info': 'Informação',

    // login
    'loginWithGoogle.buttonText': 'Entre com Google',
    'login.fail.userNotFound': 'Usuário não encontrado.',
    'login.fail.unknownError': 'Erro desconhecido ao realizar o login. $t(rq.fail.pleaseTryAgainLater)',
    
    //rq
    'rq.fail.pleaseTryAgainLater': 'Por favor, tente novamente mais tarde.\n\nCaso o problema persista, entre em contato com os administradores do sistema.',
    'rq.fail.unexpectedError': 'Ocorreu um erro inesperado. $t(rq.fail.pleaseTryAgainLater)',

    // pageNotFound
    'pageNotFound.title': '404',
    'pageNotFound.subtitle': 'Oops! Parece que essa página não existe...',
    'pageNotFound.message': 'O link que você possui está errado ou esta página se refere a um conteúdo que foi movido ou excluído.',
    'pageNotFound.home': 'Clique aqui para voltar a página inicial',
    'pageNotFound.contactUs': 'Se você acredita que deveria haver algo aqui, entre em contato com os administradores do sistema.',

    // navbar
    'navbar.documents': '$t(document_plural)',
    'navbar.documents.add': 'Adicionar',
    'navbar.documents.import': 'Importar',
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
    'document.actions.add.success': 'Documento \'<bold>{{name}}</bold>\' cadastrado com sucesso!',
    'document.actions.add.fail': 'Falha ao cadastrar o documento \'<bold>{{name}}</bold>\'. $t(rq.fail.pleaseTryAgainLater)',
    'document.actions.update.success': 'Documento \'<bold>{{name}}</bold>\' alterado com sucesso!',
    'document.actions.update.fail': 'Falha ao alterar o documento \'<bold>{{name}}</bold>\'. $t(rq.fail.pleaseTryAgainLater)',
    'document.actions.delete.success': 'Documento \'<bold>{{name}}</bold>\' excluído com sucesso!',
    'document.actions.delete.fail': 'Falha ao excluir o documento \'<bold>{{name}}</bold>\'. $t(rq.fail.pleaseTryAgainLater)',
    'documents.actions.download.fail': 'Falha ao recuperar o arquivo \'<bold>{{name}}</bold>\' do servidor. $t(rq.fail.pleaseTryAgainLater)',
    'document.import.upload.success': 'Os documentos selecionados foram enviados com sucesso ao servidor e serão importados em segundo plano.',
    'document.import.upload.fail': 'Falha ao enviar os documentos selecionados ao servidor. $t(rq.fail.pleaseTryAgainLater)',
    
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
    'document.form.updateButton': 'Salvar Alterações',
    'document.form.submitButton': 'Enviar',
    'document.form.validation.fileRequired': 'Deve anexar um arquivo',
    'document.form.validation.invalidFileType': 'O tipo de arquivo enviado não é válido',
    'document.form.validation.titleRequired': 'Titulo é obrigatório',
    'document.form.validation.categoryRequired': 'Deve selecionar uma categoria',
    
    // document search
    'searchBar.filters.category': '$t(category)',
    'searchBar.filters.date.from': 'Data de',
    'searchBar.filters.date.until': 'até',
    'searchBar.filters.status': 'Status',
    'searchBar.filters.status.choose': 'Escolha um status...',
    'searchBar.filters.status.zeroOptions': 'Nenhum status para filtrar',
    'searchBar.searchButton': 'Pesquisar documentos',
    'searchBar.moreFiltersButton': 'Mais filtros',
    'searchBar.lessFiltersButton': 'Menos filtros',
    'searchBar.filters.registeredByMe': 'Cadastrados por mim',
    'search.noResultFound.message.p1': 'Nenhum resultado encontrado',
    'search.noResultFound.message.p2': ' para ',
    'search.noResultFound.message.p3': ' com os filtros especificados.',
    'search.noResultFound.searchTips.title': 'Sugestões:',
    'search.noResultFound.searchTips.item1': 'Certifique-se de que todas as palavras estão escritas corretamente.',
    'search.noResultFound.searchTips.item2': 'Tente usar outras/menos palavras-chave.',
    'search.noResultFound.searchTips.item3': 'Certifique-se de que todos os filtros opcionais estão preenchidos corretamente.',
    'search.noResultFound.searchTips.item4': 'Tente remover os filtros e readicioná-los gradualmente.',
    'search.error': 'Houve um erro realizando a busca desejada. Por favor, tente novamente mais tarde.',
    'search.results.visualize.tooltip': 'Visualizar',
    'search.results.download.tooltip': 'Download',
    'search.results.edit.tooltip': 'Editar',
    'search.results.delete.tooltip': 'Excluir',
    'search.results.createdBy': 'Cadastrado por',
    'search.results.createdAt': 'em',
    'search.results.count': 'resultados',
    'search.results.page': 'Página',
    'search.results.page.of': 'de',
    'search.validation.noParameters': 'Preencha ao menos um campo para realizar a busca.',
    
    // user
    'user.name': 'Nome de usuário',
    'user.email': 'Email',
    'user.loggedUserInfo.fail': 'Falha ao buscar informações do usuário no servidor. $t(rq.fail.pleaseTryAgainLater)',
    'user.changeDepartment.fail': 'Falha ao trocar de departamento. $t(rq.fail.pleaseTryAgainLater)',

    // department management
    // user permission page (department)
    'users.department.page.header': 'Usuários do departamento',
    'users.department.invite.success': 'Usuário <bold>{{user}}</bold> convidado para o departamento <bold>{{dept}}</bold> com sucesso!',
    'users.department.invite.fail': 'Falha ao convidar usuário <bold>{{user}}</bold> para o departamento <bold>{{dept}}</bold>. $t(rq.fail.pleaseTryAgainLater)',
    'users.department.invite.exception.userAlreadyInvited': 'Usuário <bold>{{user}}</bold> já possui acesso ao departamento <bold>{{dept}}</bold>.',
    'users.department.edit.success': 'Permissões do usuário <bold>{{user}}</bold> no departamento <bold>{{dept}}</bold> atualizadas com sucesso!',
    'users.department.edit.fail': 'Falha ao atualizar permissões do usuário <bold>{{user}}</bold> no departamento <bold>{{dept}}</bold>. $t(rq.fail.pleaseTryAgainLater)',
    'users.department.edit.exception.lastRemainingDeptManager': 'Não é possível remover a permissão de \'<i>$t(user.table.headers.permission.manage_dept_perm)</i>\' do usuário <bold>{{user}}</bold> no departamento <bold>{{dept}}</bold> pois este é o único usuário com esta permissão no departamento!\n\nGaranta a permissão de \'<i>$t(user.table.headers.permission.manage_dept_perm)</i>\' a outro usuário e tente novamente.',
    'users.department.batchEdit.success': 'Permissões dos usuários no departamento <bold>{{dept}}</bold> atualizadas com sucesso!',
    'users.department.batchEdit.partial': 'Sucesso parcial.\nAlguns usuários não puderam ter suas permissões alteradas.',
    'users.department.batchEdit.fail': 'Falha ao atualizar permissões dos usuários no departamento <bold>{{dept}}</bold>. $t(rq.fail.pleaseTryAgainLater)',
    'users.department.batchEdit.exception.lastRemainingDeptManager': 'Não foi possível realizar todas as alterações de permissão pois um dos usuários é o único no departamento <bold>{{dept}}</bold> com a permissão de \'<i>$t(user.table.headers.permission.manage_dept_perm)</i>\'!\n\nGaranta a permissão de \'<i>$t(user.table.headers.permission.manage_dept_perm)</i>\' a outro usuário e tente novamente.',
    'users.department.delete.success': 'Acesso do usuário <bold>{{user}}</bold> ao departamento <bold>{{dept}}</bold> removido com sucesso!',
    'users.department.delete.fail': 'Falha ao remover acesso do usuário <bold>{{user}}</bold> no departamento <bold>{{dept}}</bold>. $t(rq.fail.pleaseTryAgainLater)',
    'users.department.delete.exception.lastRemainingDeptManager': 'Não é possível remover o acesso do usuário <bold>{{user}}</bold> ao departamento <bold>{{dept}}</bold> pois este é o único usuário com a permissão a permissão de \'<i>$t(user.table.headers.permission.manage_dept_perm)</i>\' no departamento!\n\nGaranta a permissão de \'<i>$t(user.table.headers.permission.manage_dept_perm)</i>\' a outro usuário e tente novamente.',

    // user table
    // headers
    'user.table.headers.status': 'Status',
    'user.table.headers.username': '$t(user.name)',
    'user.table.headers.email': '$t(user.email)',
    'user.table.headers.permission.search_docs': 'Procurar documentos',
    'user.table.headers.permission.add_docs': 'Adicionar documentos',
    'user.table.headers.permission.edit_docs_others': 'Editar qualquer documento',
    'user.table.headers.permission.delete_docs_others': 'Excluir qualquer documento',
    'user.table.headers.permission.invite_users': 'Convidar usuários',
    'user.table.headers.permission.manage_categories': 'Gerenciar categorias',
    'user.table.headers.permission.manage_dept_perm': 'Gerenciar permissões de departamento',
    'user.table.headers.permission.manage_system_perm': 'Gerenciar permissões de sistema',
    'user.table.headers.permission.manage_departments': 'Gerenciar departamentos',

    // action btn tooltips
    'userPermissions.customTable.actions.addBtn.tooltip': 'Convidar usuário',
    'userPermissions.customTable.actions.batchEditBtn.tooltip': 'Editar permissões dos usuários',
    'userPermissions.customTable.actions.filterBtn.tooltip': 'Filtrar usuários',
    'userPermissions.customTable.actions.editBtn.tooltip': 'Editar permissões do usuário',
    'userPermissions.customTable.actions.deleteBtn.tooltip': 'Remover usuário deste departamento',

    // user invite row
    'userPermissions.customTable.addRow.email.placeholder': 'Entre com o email do usuário',
    'userPermissions.customTable.addRow.validation.invalidEmailFormat': 'Email com formato inválido',
    'userPermissions.customTable.addRow.validation.invalidDomain': 'Email deve pertencer à uma das seguintes organizações: @uniriotec.br, @edu.unirio.br or @unirio.br',
    'userPermissions.customTable.addRow.addBtn.tooltip': 'Enviar convite',
    
    // filter row
    'userPermissions.customTable.filterRow.fullName.placeholder': 'Filtrar por nome de usuário',
    'userPermissions.customTable.filterRow.email.placeholder': 'Filtrar por email',
    'userPermissions.customTable.filterRow.status.y': 'Ativo',
    'userPermissions.customTable.filterRow.status.n': 'Pendente',
    
    // table data
    'user.table.data.status.y.tooltip': 'Ativo',
    'user.table.data.status.n.tooltip': 'Pendente',

    // system management
    // departments page
    'departments.page.header': 'Departamentos',
    'departments.add.success': 'Departmento <bold>{{name}}</bold> (<bold>{{acronym}}</bold>) criado com sucesso!',
    'departments.add.fail': 'Falha ao criar departamento <bold>{{name}}</bold> (<bold>{{acronym}}</bold>). $t(rq.fail.pleaseTryAgainLater)',
    'departments.edit.success': 'Departmento <bold>{{oldName}}</bold> (<bold>{{oldAcronym}}</bold>) alterado para <bold>{{name}}</bold> (<bold>{{acronym}}</bold>) com sucesso!',
    'departments.edit.fail': 'Falha ao alterar departmento <bold>{{oldName}}</bold> (<bold>{{oldAcronym}}</bold>) para <bold>{{name}}</bold> (<bold>{{acronym}}</bold>). $t(rq.fail.pleaseTryAgainLater)',
    'departments.edit.exception.departmentAcronymLengthOverflow': 'Não foi possível alterar a sigla do departamento <bold>{{oldAcronym}}</bold> para <bold>{{acronym}}</bold> pois o comprimento máximo permitido é de 5 caracteres.',
    'departments.batchEdit.success': 'Departamentos atualizados com sucesso!',
    'departments.batchEdit.partial': 'Sucesso parcial.\nAlguns departamentos não puderam ser alterados.',
    'departments.batchEdit.fail': 'Falha ao atualizar departamentos. $t(rq.fail.pleaseTryAgainLater)',
    'departments.delete.success': 'Departamento <bold>{{name}}</bold> (<bold>{{acronym}}</bold>) excluído com sucesso!',
    'departments.delete.fail': 'Falha ao excluir departmento <bold>{{name}}</bold> (<bold>{{acronym}}</bold>). $t(rq.fail.pleaseTryAgainLater)',

    // warning modal
    'departments.warningModal.title': '$t(warning)',
    'departments.warningModal.body.line1': 'Você quer excluir permanentemente o departamento <bold>{{name}}</bold> (<bold>{{acronym}}</bold>) e todos os seus conteúdos?',
    'departments.warningModal.body.line2': 'Para confirmar digite "<bold>$t(delete) {{name}}</bold>" na caixa de texto a seguir:',
    'departments.warningModal.btns.cancel': 'Cancelar',
    'departments.warningModal.btns.delete': 'Excluir',

    // departments table
    // headers
    'departments.table.headers.acronym': 'Sigla',
    'departments.table.headers.numUsers': 'Nº Usuários',
    'departments.table.headers.name': 'Nome',

    // action btn tooltips

    // add department row
    'departments.customTable.addRow.acronym.placeholder': 'Entre a sigla do departamento',
    'departments.customTable.addRow.name.placeholder': 'Entre o nome do departamento',
    'departments.customTable.addRow.addBtn.tooltip': 'Adicionar novo departamento',
    'departments.customTable.addRow.validation.acronymMaxLength': 'Sigla deve ter no máximo 5 caracteres',
    'departments.customTable.addRow.validation.cantContainWhitespaces': 'Sigla não pode conter espaços em branco',
    
    // filter row
    'departments.customTable.filterRow.acronym.placeholder': 'Filtrar pela sigla',
    'departments.customTable.filterRow.name.placeholder': 'Filtrar pelo nome do departamento',
    
    // table data
    'departments.table.data.isCurrentDept.y': 'Departamento atual',

    // user permission page (system)
    'users.system.page.header': 'Usuários do sistema',
    'users.system.edit.success': 'Permissões do usuário <bold>{{user}}</bold> atualizadas com sucesso!',
    'users.system.edit.fail': 'Falha ao atualizar permissões do usuário <bold>{{user}}</bold>. $t(rq.fail.pleaseTryAgainLater)',
    'users.system.edit.exception.lastRemainingSystemManager': 'Não é possível remover a permissão de \'<i>$t(user.table.headers.permission.manage_system_perm)</i>\' do usuário <bold>{{user}}</bold> pois este é o único usuário no sistema com esta permissão!\n\nGaranta a permissão de \'<i>$t(user.table.headers.permission.manage_system_perm)</i>\' a outro usuário e tente novamente.',
    'users.system.batchEdit.success': 'Permissões dos usuários atualizadas com sucesso!',
    'users.system.batchEdit.partial': 'Sucesso parcial.\nAlguns usuários não puderam ter suas permissões alteradas.',
    'users.system.batchEdit.fail': 'Falha ao atualizar permissões dos usuários. $t(rq.fail.pleaseTryAgainLater)',

    // categories
    'categories.page.title': 'Categorias',
    'categories.add.success': 'Categoria \'<bold>{{name}}</bold>\' cadastrada com sucesso!',
    'categories.add.fail': 'Falha ao cadastrar categoria \'<bold>{{name}}</bold>\'. $t(rq.fail.pleaseTryAgainLater)',
    'categories.update.success': 'Categoria \'<bold>{{oldName}}</bold>\' renomeada para \'<bold>{{newName}}</bold>\' com sucesso!',
    'categories.update.fail': 'Falha ao renomear categoria \'<bold>{{oldName}}</bold>\' para \'<bold>{{newName}}</bold>\'. $t(rq.fail.pleaseTryAgainLater)',
    'categories.update.exception.unnamedCategory': 'Não é possível renomear a categoria \'<bold>{{name}}</bold>\' para um nome vazio!',
    'categories.delete.success': 'Categoria \'<bold>{{name}}</bold>\' excluída com sucesso!',
    'categories.delete.fail': 'Falha ao excluir categoria \'<bold>{{name}}</bold>\'. $t(rq.fail.pleaseTryAgainLater)',
    'categories.delete.exception.categoryHasChildren': 'Não é possível excluir a categoria \'<bold>{{name}}</bold>\' pois existem subcategorias associadas a ela.',
    'categories.delete.exception.categoryHasDocuments': 'Não é possível excluir a categoria \'<bold>{{name}}</bold>\' pois existem documentos associados a ela.',

    // import from google drive
    'import.page.title': 'Importar do Google Drive',
    'import.table.headers.account': 'Conta',
    'import.table.headers.name': 'Nome',
    'import.table.headers.category': 'Categoria',
    'import.table.headers.date': 'Data',
    'import.table.headers.actions': 'Ações',
    'import.table.headers.popover.btns.primary.label': 'Definir para todos',
    'import.table.headers.popover.btns.secondary.label': 'Definir para vazios',
    'import.table.content.empty': 'Nenhum documento para importação',
    'import.table.content.actions.import': 'Importar',
    'import.table.content.validation.info': 'Parece haver um problema com esse arquivo. Por favor remova e adicione-o novamente antes de importar.',
    'import.page.btns.selectFromDrive': 'Selecionar do Google Drive',
    'import.page.btns.switchAccount': 'Trocar Conta',
    'import.page.btns.removeSelected': 'Remover Selecionados',
    'import.page.btns.importSelected': 'Importar Selecionados',
    'import.warningModal.title': '$t(notifications.header.default.warning)',
    'import.warningModal.body.line1': 'Existem itens na lista para importação.',
    'import.warningModal.body.line2': 'Deseja acrescentar os novos itens ou substituí-los?',
    'import.warningModal.btns.cancel': 'Cancelar',
    'import.warningModal.btns.append': 'Adicionar',
    'import.warningModal.btns.replace': 'Substituir',
    'import.google.fail': 'Falha ao se conectar com o Google. Por favor, tente mais tarde.',
    'import.google.searchDocuments.fail': 'Falha ao buscar alguns dos documentos no Google Drive. $t(rq.fail.pleaseTryAgainLater)',

    // exception messages
    'exception.unauthorized': 'Acesso não autorizado. Por favor, faça o login novamente.',
    'exception.resourceNotFound': 'Recurso não encontrado no servidor.',
}

export default ptBR;