import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  ROTULO_STATUS_PROJETO,
  StatusProjeto,
} from '../../core/models/enums';
import { Equipe, Projeto } from '../../core/models/models';
import { corStatusProjeto } from '../../core/models/ui-helpers';
import { EquipeService } from '../../core/services/equipe.service';
import { ProjetoService } from '../../core/services/projeto.service';

@Component({
  selector: 'app-projetos',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './projetos.component.html',
  styleUrl: './projetos.component.scss',
})
export class ProjetosComponent {
  private readonly fb = inject(FormBuilder);
  private readonly projetoService = inject(ProjetoService);
  private readonly equipeService = inject(EquipeService);

  protected readonly projetos = signal<Projeto[]>([]);
  protected readonly equipes = signal<Equipe[]>([]);
  protected readonly carregando = signal(true);
  protected readonly erro = signal<string | null>(null);
  protected readonly mostrarForm = signal(false);
  protected readonly salvando = signal(false);

  protected readonly total = computed(() => this.projetos().length);

  protected readonly rotuloStatus = ROTULO_STATUS_PROJETO;
  protected readonly corStatus = corStatusProjeto;

  protected readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    descricao: [''],
    equipeId: ['', [Validators.required]],
  });

  constructor() {
    this.carregar();
  }

  private carregar(): void {
    this.carregando.set(true);
    this.projetoService.listar().subscribe({
      next: (lista) => {
        this.projetos.set(lista);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Falha ao carregar projetos. A API esta rodando?');
        this.carregando.set(false);
      },
    });

    this.equipeService.listar().subscribe({
      next: (lista) => {
        this.equipes.set(lista);
        if (lista.length > 0) {
          this.form.controls.equipeId.setValue(lista[0].id);
        }
      },
      error: () => {},
    });
  }

  protected alternarForm(): void {
    this.mostrarForm.update((v) => !v);
  }

  protected criar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.salvando.set(true);
    const valor = this.form.getRawValue();

    this.projetoService
      .criar({
        nome: valor.nome,
        descricao: valor.descricao || null,
        equipeId: valor.equipeId,
      })
      .subscribe({
        next: (novo) => {
          this.projetos.update((atual) => [novo, ...atual]);
          this.salvando.set(false);
          this.mostrarForm.set(false);
          this.form.reset({
            nome: '',
            descricao: '',
            equipeId: this.equipes()[0]?.id ?? '',
          });
        },
        error: () => {
          this.salvando.set(false);
          this.erro.set('Nao foi possivel criar o projeto.');
        },
      });
  }

  protected remover(projeto: Projeto, evento: Event): void {
    evento.preventDefault();
    evento.stopPropagation();
    if (!confirm(`Remover o projeto "${projeto.nome}"?`)) {
      return;
    }
    this.projetoService.remover(projeto.id).subscribe({
      next: () =>
        this.projetos.update((atual) => atual.filter((p) => p.id !== projeto.id)),
      error: () => this.erro.set('Nao foi possivel remover o projeto.'),
    });
  }

  protected readonly StatusProjeto = StatusProjeto;
}
