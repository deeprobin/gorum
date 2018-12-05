import { Component, OnInit } from '@angular/core';
import { Language } from '../language';
import { Config } from '../config';
import { ActivatedRoute } from '@angular/router';
import { Board } from '../board/board.component';
import { Title } from '@angular/platform-browser';
import { AngularEditorConfig, AngularEditorToolbarComponent } from '@kolkov/angular-editor';

@Component({
  selector: 'app-new-thread',
  templateUrl: './new-thread.component.html',
  styleUrls: ['./new-thread.component.css']
})
export class NewThreadComponent implements OnInit {
  config = Config;
  conf = Config.get;
  lang = Language.get;

  id = +this.route.snapshot.paramMap.get('id');
  board: Board;
  threadTitle: string;
  content: string;

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '6rem',
    placeholder: Language.get('content'),
    translate: 'no',
    // TODO: Upload URL
  };

  constructor(private route: ActivatedRoute,
    private title: Title) { }

  ngOnInit() {
    Config.setLogin(true);
    Config.API('board', { boardID: this.id })
      .subscribe(values => this.initBoard(values));
  }

  initBoard(values: any) {
    this.board = new Board(values['id'], values['name'], values['description'], values['icon'], values['sort']);
    this.title.setTitle(
      Language.get('newThread') + ' - ' + Config.get('title')
    );
  }
}
