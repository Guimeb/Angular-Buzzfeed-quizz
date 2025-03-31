import { Component, OnInit } from '@angular/core';
import quizz_questions from "../../../assets/data/quizz_questions.json"

@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.css']
})
export class QuizzComponent implements OnInit {

  title: string = "";

  questions: any;
  questionSelected: any;

  answers: string[] = [];
  answerSelected: string = "";

  questionIndex: number = 0;
  questionMaxIndex: number = 0;

  finished: boolean = false;

  constructor() { }

  ngOnInit(): void {
    if (quizz_questions) {
      this.finished = false;
      this.title = quizz_questions.title;
      this.questions = quizz_questions.questions;

      this.questions.forEach((question: any) => {
        question.options = this.shuffleArray(question.options);
      });


      this.questionIndex = 0;
      this.questionMaxIndex = this.questions.length;
      this.questionSelected = this.questions[this.questionIndex];

      console.log(this.questionIndex);
      console.log(this.questionMaxIndex);
    }
  }

  shuffleArray(array: any[]): any[] {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  playerChoose(value: string) {
    this.answers.push(value);
    this.nextStep();
  }

  async nextStep() {
    this.questionIndex += 1;

    if (this.questionMaxIndex > this.questionIndex) {
      this.questionSelected = this.questions[this.questionIndex];
    } else {
      const finalAnswer: string = await this.checkResult(this.answers);
      this.finished = true;
      this.answerSelected = quizz_questions.results[finalAnswer as keyof typeof quizz_questions.results];
    }
  }

  async checkResult(answers: string[]): Promise<string> {
    let frequency: { [key: string]: number } = {};

    answers.forEach((answer, index) => {
      const weight = 1;
      frequency[answer] = (frequency[answer] || 0) + weight;
    });

    let maxScore = 0;
    for (let key in frequency) {
      if (frequency[key] > maxScore) {
        maxScore = frequency[key];
      }
    }

    let potentialResults: string[] = [];
    for (let key in frequency) {
      if (frequency[key] === maxScore) {
        potentialResults.push(key);
      }
    }

    if (potentialResults.length > 1) {
      const randomIndex = Math.floor(Math.random() * potentialResults.length);
      return potentialResults[randomIndex];
    }

    return potentialResults[0];
  }
}
