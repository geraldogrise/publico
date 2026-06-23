import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  COLUNAS_KANBAN,
  PrioridadeTarefa,
  ROTULO_PRIORIDADE,
  ROTULO_STATUS_TAREFA,
  StatusTarefa,
} from '../../core/models/enums';
import { Projeto, Tarefa } from '../../core/models/models';
import { corPrioridade } from '../../core/models/ui-helpers';
import { ProjetoService } from '../../core/services/projeto.service';
import { TarefaService } from '../../core/services/tarefa.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly tarefaService = inject(TarefaService);
  private readonly projetoService = inject(ProjetoService);

  protected readonly projetoId = this.route.snapshot.paramMap.get('id') ?? '';

  protected readonly tarefas = signal<Tarefa[]>([]);
  protected readonly projeto = signal<Projeto | null>(null);
  protected readonly carregando = signal(true);
  protected readonly erro = signal<string | null>(null);
  protected readonly mostrarForm = signal(false);
  protected readonly salvando = signal(false);
  protected readonly arrastandoId = signal<string | null>(null);

  protected readonly colunas = COLUNAS_KANBAN;
  protected readonly rotuloStatus = ROTULO_STATUS_TAREFA;
  protected readonly rotuloPrioridade = ROTULO_PRIORIDADE;
  protected readonly corPrioridade = corPrioridade;
  protected readonly prioridades = [
    PrioridadeTarefa.Baixa,
    PrioridadeTarefa.Media,
    PrioridadeTarefa.Alta,
    PrioridadeTarefa.Critica,
  ];

  /** Agrupa tarefas por status para renderizar as colunas (computed/signals). */
  protected readonly porColuna = computed(() => {
    const mapa = new Map<StatusTarefa, Tarefa[]>();
    for (const col of this.colunas) {
      mapa.set(col, []);
    }
    for (const t of this.tarefas()) {
      mapa.get(t.status)?.push(t);
    }
    return mapa;
  });

  protected readonly form = this.fb.nonNullable.group({
    titulo: ['', [Validators.required, Validators.minLength(3)]],
    descricao: [''],
    prioridade: [PrioridadeTarefa.Media, [Validators.required]],
    status: [StatusTarefa.Backlog, [Validators.required]],
  });

  constructor() {
    this.carregar();
  }

  protected tarefasDe(status: StatusTarefa): Tarefa[] {
    return this.porColuna().get(status) ?? [];
  }

  private carregar(): void {
    this.carregando.set(true);

    this.projetoService.obter(this.projetoId).subscribe({
      next: (p) => this.projeto.set(p),
      error: () => {},
    });

    this.tarefaService.listarPorProjeto(this.projetoId).subscribe({
      next: (lista) => {
        this.tarefas.set(lista);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Falha ao carregar tarefas.');
        this.carregando.set(false);
      },
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
    const v = this.form.getRawValue();

    this.tarefaService
      .criar({
        titulo: v.titulo,
        descricao: v.descricao || null,
        projetoId: this.projetoId,
        prioridade: v.prioridade,
        status: v.status,
      })
      .subscribe({
        next: (nova) => {
          this.tarefas.update((atual) => [...atual, nova]);
          this.salvando.set(false);
          this.mostrarForm.set(false);
          this.form.reset({
            titulo: '',
            descricao: '',
            prioridade: PrioridadeTarefa.Media,
            status: StatusTarefa.Backlog,
          });
        },
        error: () => {
          this.salvando.set(false);
          this.erro.set('Nao foi possivel criar a tarefa.');
        },
      });
  }

  protected remover(t: Tarefa, evento: Event): void {
    evento.stopPropagation();
    if (!confirm(`Remover a tarefa "${t.titulo}"?`)) {
      return;
    }
    this.tarefaService.remover(t.id).subscribe({
      next: () =>
        this.tarefas.update((atual) => atual.filter((x) => x.id !== t.id)),
      error: () => this.erro.set('Nao foi possivel remover a tarefa.'),
    });
  }

  // ===== Drag and drop nativo =====
  protected aoArrastar(t: Tarefa): void {
    this.arrastandoId.set(t.id);
  }

  protected aoSoltar(status: StatusTarefa): void {
    const id = this.arrastandoId();
    this.arrastandoId.set(null);
    if (!id) {
      return;
    }

    const tarefa = this.tarefas().find((x) => x.id === id);
    if (!tarefa || tarefa.status === status) {
      return;
    }

    // Atualizacao otimista da UI.
    const statusAnterior = tarefa.status;
    this.tarefas.update((atual) =>
      atual.map((x) => (x.id === id ? { ...x, status } : x)),
    );

    this.tarefaService.mover(id, { status }).subscribe({
      error: () => {
        // Reverte em caso de falha.
        this.tarefas.update((atual) =>
          atual.map((x) => (x.id === id ? { ...x, status: statusAnterior } : x)),
        );
        this.erro.set('Falha ao mover a tarefa.');
      },
    });
  }

  protected permitirSoltar(evento: DragEvent): void {
    evento.preventDefault();
  }

  protected readonly StatusTarefa = StatusTarefa;
}
