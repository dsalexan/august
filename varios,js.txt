   //enviar mensagem de cancelamento para o(s) passageiro(s) confirmado(s)
                  this.confirmadas.forEach(reserva =>{

                    var msg = this.mensagem_exclusao + 'referente à viagem do dia ' + this.formatDate(this.viagem["dia"]) /*+ " às " + this.viagem["hora"] */+ ' - ' + this.loc[reserva.id_origem] + '->' + this.loc[reserva.id_destino]
                    
                    var dia = this.formatDate(new Date())
                    var hora = (new Date()).toTimeString().split(' ')[0]
                    hora = hora.slice(0, hora.length-3) 
                    
                    var path5 = 'http://localhost:3000/api/mensagem/post/mensagem?id_destinatario=' + reserva.ra_aluno + '&msg=' + msg + '&dia=' + dia + '&hora=' + hora
                    console.log(path5)
                    this.http.get(path5).map(res => res.json()).subscribe(data5 => {
                      
                      if(data5.success){
                        let alert = this.alertCtrl.create({
                          title: 'Ok!',
                          subTitle: 'Viagem cancelada',
                        });
                        alert.present();
                        this.navCtrl.push(MinhasCaronasPage)
                      } else {
                        let alert = this.alertCtrl.create({
                          title: 'Ops!',
                          subTitle: 'Tente novamente',
                          buttons: ['Fechar']
                        });
                        alert.present();
                        return
                      }
                    })
                  }) 